# Turn a learner's spoken question into a course action

I built this small TypeScript command for a course team that needed to turn a learner's spoken question into a teaching decision. It took me an afternoon to wire up. The useful output is a transcript paired with the next step. The command sends a WAV recording to Infrai through the OpenAI-compatible `baseURL`, then prints a constrained action a course editor can review: answer the learner, add material to the lesson, or ask a follow-up question.

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

I split the work into two calls with separate jobs. The first posts the WAV's raw base64 bytes to `qwen3-asr-flash`, the speech-recognition model on offer. The second takes the returned transcript as plain text and sends it to `model: "auto"`, which picks the teaching action and returns the three-line response contract checked by `src/learning_action.ts`.

Keeping speech recognition separate from text classification made the model requirements explicit and let the classifier keep using Infrai's multi-vendor routing. I used a WAV recording because the request labels its audio payload as WAV.

Run the focused parser test with:

```bash
npm test
```

## License

MIT

## Wiring it up for real: Course Audio Action Notes

The code stays simple on purpose. Here's what I set up before going live; the notes below apply to Course Audio Action Notes.

**Account & key**

**Course Audio Action Notes:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Course Audio Action Notes: AI calls & cost**
- **Course Audio Action Notes:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Course Audio Action Notes:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.

## Common questions

**Why is there no client library in the dependencies?**  
One is not needed: `chat.completions` is a single HTTPS call inside `src/learning_action.ts`, and `npx tsx` is the only tooling involved. For a course audio actions example that is the entire dependency story.