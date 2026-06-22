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
