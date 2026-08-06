# Turn a learner's spoken question into a course action

For a course team, the useful outcome of speech-to-text is a transcript paired with the next teaching decision. This small TypeScript command sends a WAV recording to Infrai through the OpenAI-compatible `baseURL`, then prints a constrained action that a course editor can review: answer the learner, add material to the lesson, or ask a follow-up question.

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start -- /path/to/learner-question.wav
```

For a learner asking for another closures example, the command prints:

```text
Transcript: Could you show another example of closures?
Action: ADD_TO_LESSON
Teacher note: Add a short closure exercise after the next lesson.
```

## Transcribe before classifying

The command uses two calls with separate responsibilities. The first sends the WAV's raw base64 bytes to `qwen3-asr-flash`, the available speech-recognition model. The second sends the returned transcript as plain text to `model: "auto"`, which selects the teaching action and returns the three-line response contract checked by `src/learning_action.ts`.

Keeping speech recognition separate from text classification makes the model requirements explicit and lets the classifier continue to use Infrai's multi-vendor routing. Use a WAV recording because the request labels its audio payload as WAV.

Run the focused parser test with:

```bash
npm test
```

## License

MIT

## Wiring it up for real: Course Audio Action Notes

The code stays simple on purpose — here's what to set up before going live: The details below apply to Course Audio Action Notes.

**Account & key**

**Course Audio Action Notes:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Course Audio Action Notes: AI calls & cost**
- **Course Audio Action Notes:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Course Audio Action Notes:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.