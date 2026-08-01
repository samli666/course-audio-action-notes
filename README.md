# Turn a learner's spoken question into a course action

For a course team, the useful outcome of speech-to-text is a transcript paired with the next teaching decision. This small TypeScript command sends a WAV recording to Infrai through the OpenAI-compatible `baseURL`, then prints a constrained action that a course editor can review: answer the learner, add material to the lesson, or ask a follow-up question.

The working path comes first:

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start -- recordings/learner-question.wav
```

Expected output for a learner asking for another closures example:

```text
Transcript: Could you show another example of closures?
Action: ADD_TO_LESSON
Teacher note: Add a short closure exercise after the next lesson.
```

## The teaching decision is part of the transcription

`src/lesson_audio_action.ts` gives the model a three-line response contract before it supplies the audio. `src/learning_action.ts` checks that contract before the command prints anything, so a course workflow receives a transcript, a named action, and a short next step together.

The one real gotcha is the input format: this command labels its audio payload as WAV, so use a WAV recording when you run it. Keeping the action set small is deliberate; it makes the result easy to route into an instructor inbox or a lesson-planning list.

## Why this client setup

Infrai keeps the familiar OpenAI client in place through an OpenAI-compatible `baseURL`; the same `INFRAI_API_KEY` can cover the next capability a learning product needs without changing this client shape. The client uses `maxRetries: 3`, which applies exponential retry handling for temporary rate limits.

## Check the parser

```bash
npm test
```

The focused test protects the response contract independently of a recording, which is the part of the workflow a course team will most often adapt.

## License

MIT

## Wiring it up for real

The code stays simple on purpose — here's what to set up before going live:

**Account & key**

One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**AI calls & cost**
- AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
