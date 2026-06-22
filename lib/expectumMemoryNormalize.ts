export type NormalizableThreadMessage = {
  role?: "user" | "assistant";
  text?: string;
  createdAt?: string;
  sessionId?: string;
  mode?: string;
};

export type MeetingThreadSnapshot<
  TMessage extends NormalizableThreadMessage = NormalizableThreadMessage,
> = {
  id: string;
  thread: TMessage[] | null;
  created_at: string;
};

export type CountableMeetingSnapshot<
  TMessage extends NormalizableThreadMessage = NormalizableThreadMessage,
> = MeetingThreadSnapshot<TMessage> & {
  mode?: string | null;
};

export type MeetingCountSummary = {
  rowCount: number;
  encounterCount: number;
  meetingCount: number;
  thoughtCount: number;
  explorationCount: number;
};

export type TimelineMeetingSnapshot<
  TMessage extends NormalizableThreadMessage = NormalizableThreadMessage,
> = CountableMeetingSnapshot<TMessage> & {
  question?: string | null;
};

export type MeetingEncounterSummary = {
  encounterId: string;
  text: string;
  mode: string;
  createdAt: string;
};

function getMessageIdentity(message: NormalizableThreadMessage) {
  if (!message.role || typeof message.text !== "string" || !message.createdAt) {
    return null;
  }

  return JSON.stringify([
    message.role,
    message.text,
    message.createdAt,
    message.sessionId ?? null,
    message.mode ?? null,
  ]);
}

function hasValidTimestamp(message: NormalizableThreadMessage) {
  return Boolean(
    message.createdAt && !Number.isNaN(Date.parse(message.createdAt))
  );
}

/**
 * Read-time normalization only. Source records remain unchanged, input arrays
 * are never mutated, and exact provenance fields are part of duplicate
 * identity. Messages without createdAt are preserved rather than guessed at.
 */
export function normalizeThreadMessages<
  TMessage extends NormalizableThreadMessage,
>(messages: readonly TMessage[]): TMessage[] {
  const seen = new Set<string>();
  const normalized: TMessage[] = [];

  messages.forEach((message) => {
    const copy = { ...message };
    const identity = getMessageIdentity(copy);

    if (identity && seen.has(identity)) {
      return;
    }

    if (identity) {
      seen.add(identity);
    }

    normalized.push(copy);
  });

  if (!normalized.every(hasValidTimestamp)) {
    return normalized;
  }

  return normalized
    .map((message, index) => ({ message, index }))
    .sort((a, b) => {
      const timeDifference =
        Date.parse(a.message.createdAt!) - Date.parse(b.message.createdAt!);

      return timeDifference || a.index - b.index;
    })
    .map(({ message }) => message);
}

/**
 * Removes exact repeated messages across cumulative meeting snapshots at read
 * time. The returned records are copies in their original row order; no source
 * row is updated or deleted. This is a first step before any persistence
 * migration.
 */
export function normalizeMeetingThreadSnapshots<
  TMessage extends NormalizableThreadMessage,
  TMeeting extends MeetingThreadSnapshot<TMessage>,
>(meetings: readonly TMeeting[]): TMeeting[] {
  const indexedMeetings = meetings.map((meeting, index) => ({
    meeting,
    index,
  }));
  const allMeetingDatesValid = indexedMeetings.every(
    ({ meeting }) => !Number.isNaN(Date.parse(meeting.created_at))
  );
  const processingOrder = allMeetingDatesValid
    ? [...indexedMeetings].sort(
        (a, b) =>
          Date.parse(a.meeting.created_at) -
            Date.parse(b.meeting.created_at) || a.index - b.index
      )
    : indexedMeetings;
  const seen = new Set<string>();
  const normalizedByIndex = new Map<number, TMeeting>();

  processingOrder.forEach(({ meeting, index }) => {
    const thread = Array.isArray(meeting.thread)
      ? normalizeThreadMessages(meeting.thread).filter((message) => {
          const identity = getMessageIdentity(message);

          if (!identity) {
            return true;
          }

          if (seen.has(identity)) {
            return false;
          }

          seen.add(identity);
          return true;
        })
      : meeting.thread;

    normalizedByIndex.set(index, {
      ...meeting,
      thread,
    });
  });

  return meetings.map((meeting, index) => {
    const normalizedMeeting = normalizedByIndex.get(index);

    return normalizedMeeting || {
      ...meeting,
      thread: Array.isArray(meeting.thread)
        ? meeting.thread.map((message) => ({ ...message }))
        : meeting.thread,
    };
  });
}

/**
 * Counts distinct encounter/session identities at read time while retaining the
 * raw row count separately for technical diagnostics. Source rows are not
 * changed. A row ID is used only when no session ID is present in its thread.
 */
export function getMeetingCountSummary<
  TMessage extends NormalizableThreadMessage,
  TMeeting extends CountableMeetingSnapshot<TMessage>,
>(meetings: readonly TMeeting[]): MeetingCountSummary {
  const encounterModes = new Map<string, string>();

  meetings.forEach((meeting) => {
    const sessionModes = new Map<string, string>();

    if (Array.isArray(meeting.thread)) {
      meeting.thread.forEach((message) => {
        if (!message.sessionId) {
          return;
        }

        if (!sessionModes.has(message.sessionId)) {
          sessionModes.set(
            message.sessionId,
            message.mode || meeting.mode || "meeting"
          );
        }
      });
    }

    if (sessionModes.size === 0) {
      sessionModes.set(meeting.id, meeting.mode || "meeting");
    }

    sessionModes.forEach((mode, sessionId) => {
      if (!encounterModes.has(sessionId)) {
        encounterModes.set(sessionId, mode);
      }
    });
  });

  const modes = Array.from(encounterModes.values());

  return {
    rowCount: meetings.length,
    encounterCount: encounterModes.size,
    meetingCount: modes.filter(
      (mode) => mode !== "thought" && mode !== "exploration"
    ).length,
    thoughtCount: modes.filter((mode) => mode === "thought").length,
    explorationCount: modes.filter((mode) => mode === "exploration").length,
  };
}

/**
 * Creates one read-time Timeline summary per encounter/session. Cumulative
 * source rows remain unchanged. Rows without session provenance are preserved
 * separately by their row ID instead of being merged speculatively.
 */
export function getMeetingEncounterSummaries<
  TMessage extends NormalizableThreadMessage,
  TMeeting extends TimelineMeetingSnapshot<TMessage>,
>(meetings: readonly TMeeting[]): MeetingEncounterSummary[] {
  const encounters = new Map<
    string,
    {
      fallbackText: string;
      fallbackCreatedAt: string;
      mode: string;
      messages: TMessage[];
    }
  >();
  const chronologicalMeetings = [...meetings].sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)
  );

  chronologicalMeetings.forEach((meeting) => {
    const messagesBySession = new Map<string, TMessage[]>();

    if (Array.isArray(meeting.thread)) {
      meeting.thread.forEach((message) => {
        if (!message.sessionId) {
          return;
        }

        const messages = messagesBySession.get(message.sessionId) || [];
        messages.push({ ...message });
        messagesBySession.set(message.sessionId, messages);
      });
    }

    if (messagesBySession.size === 0) {
      messagesBySession.set(meeting.id, []);
    }

    messagesBySession.forEach((messages, encounterId) => {
      const existing = encounters.get(encounterId);

      encounters.set(encounterId, {
        fallbackText:
          existing?.fallbackText || meeting.question || "",
        fallbackCreatedAt:
          existing?.fallbackCreatedAt || meeting.created_at,
        mode:
          existing?.mode ||
          messages.find((message) => message.mode)?.mode ||
          meeting.mode ||
          "meeting",
        messages: normalizeThreadMessages([
          ...(existing?.messages || []),
          ...messages,
        ]),
      });
    });
  });

  return Array.from(encounters.entries()).map(([encounterId, encounter]) => {
    const firstUserMessage = encounter.messages.find(
      (message) => message.role === "user" && message.text
    );
    const firstTimestampedMessage = encounter.messages.find(
      (message) => message.createdAt
    );

    return {
      encounterId,
      text: firstUserMessage?.text || encounter.fallbackText,
      mode: firstUserMessage?.mode || encounter.mode,
      createdAt:
        firstUserMessage?.createdAt ||
        firstTimestampedMessage?.createdAt ||
        encounter.fallbackCreatedAt,
    };
  });
}
