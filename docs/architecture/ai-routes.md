# AI routes and Aim behavior

## OpenAI integration

Server route handlers create an OpenAI client with `OPENAI_API_KEY` and use
Chat Completions. Model names come from environment variables.

All current AI prompts:

- request Estonian output;
- include the shared `EXPECTUM_VOICE` contract;
- prefer noticing over interpretation;
- reject diagnosis, instruction, and certainty about the person;
- may include approved collective echo as limited background context.

The route handlers contain no explicit request-level Supabase authentication
check. Their current callers are authenticated pages, but direct API access
protection is **Needs verification**.

## Attunement

### Participant flow

- `/attunement` is a quiet opening page.
- `/attunement-question` reads recent meetings, echoes, and the latest journey
  notice.
- The page calls `POST /api/attunement-question`.
- The chosen generated question is stored locally and passed into
  `/reflection`.

### API

**Route:** `POST /api/attunement-question`

**File:** `app/api/attunement-question/route.ts`

**Model:** `OPENAI_ATTUNEMENT_MODEL`

Input includes:

- recent meeting history;
- saved echoes;
- latest journey notice;
- approved collective Aim memory.

Output is one quiet question. If generation fails, the handler returns a
fallback question.

## Reflection

### Participant flow

- `/question` accepts a user-authored question and meeting mode.
- `/reflection` maintains the meeting thread.
- The page calls `POST /api/reflect`.
- Successful meeting data is stored in local memory and the `meetings` table.
- A reflection may be saved as an echo in the `echoes` table or submitted as a
  shared insight.

### API

**Route:** `POST /api/reflect`

**File:** `app/api/reflect/route.ts`

**Model:** `OPENAI_REFLECTION_MODEL`

Supported modes:

- `meeting`: simple, direct, and calm;
- `thought`: stays closer to the participant's thought language;
- `exploration`: may explore perspectives and tensions without trying to win,
  direct, or conclude.

The prompt explicitly avoids diagnosis, certainty, coaching, automatic
question endings, and invented meaning.

## Journey

### Participant flow

- `/journey` reads meetings, echoes, earlier journey notices, and grouped
  sessions.
- It calls `POST /api/journey`.
- A new noticing is saved to `journey_notices` when source counts differ from
  the latest saved notice.
- The latest generated text is also stored locally.

### API

**Route:** `POST /api/journey`

**File:** `app/api/journey/route.ts`

**Model:** `OPENAI_JOURNEY_MODEL`

The response structure asks for:

1. journey noticing;
2. visible recurring themes;
3. change noticing;
4. possible echo;
5. an optional quiet question.

The prompt requires restraint when change is not visible.

## Trajectory

### Participant flow

- `/trajectory` reads recent meetings, echoes, journey notices, and locally
  derived themes.
- It calls `POST /api/trajectory`.
- The latest generated trajectory is stored locally.
- A participant can save it to the `directions` table and local trajectory
  history.

### API

**Route:** `POST /api/trajectory`

**File:** `app/api/trajectory/route.ts`

**Model:** `OPENAI_JOURNEY_MODEL`

The response structure asks for:

1. a possible movement direction;
2. what appears to strengthen;
3. what appears to fade or remain behind;
4. an optional quiet directional question.

A direction is explicitly not a prediction, destination, instruction, or
action plan.

## `EXPECTUM_VOICE`

**File:** `lib/expectumVoice.ts`

`EXPECTUM_VOICE` is a shared prompt fragment defining the language and posture
of Aim:

- natural, correct, modern Estonian;
- simple sentences and clear reference;
- calm rhythm and room for silence;
- noticing before interpretation;
- no lecture, moral, pressure, judgment, or unnecessary complexity;
- no inflated spiritual vocabulary;
- no need to explain or fill every silence.

## Collective Aim memory

`lib/collectiveAimMemory.ts` reads approved records from `shared_insights` and
recurring themes from `lib/collectiveEchoThemes.ts`.

This material is inserted into AI prompts only as quiet background. The prompt
forbids:

- treating collective echo as evidence about the current person;
- assigning the person to a group;
- deriving conclusions about the person from collective patterns.

## Aim's architectural role

Aim should remain a space-holder, not a coach or therapist.

In practical prompt and product terms:

- Aim notices what is visible in the participant's text.
- Aim does not diagnose mental or emotional conditions.
- Aim does not claim hidden knowledge about the participant.
- Aim does not prescribe goals, plans, or behavior.
- Aim does not decide meaning, direction, or outcome.
- Aim may offer a tentative observation or question only when it leaves more
  room for the meeting.
- Silence and non-conclusion are valid outcomes.

Changes to AI prompts should preserve these constraints across all AI routes.
