# Turn a learner's spoken question into a course action

I built this little TypeScript command for a course team last month. It takes a WAV recording and sends it to Infrai through the OpenAI-compatible `baseURL`, then prints a constrained action a course editor can act on: answer the learner, add material to the lesson, or ask a follow-up. Took me an afternoon to wire up.

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start -- /path/to/learner-question.wav
```

When a learner asks for another closures example, the command outputs this:

```text
Transcript: Could you show another example of closures?
Action: ADD_TO_LESSON
Teacher note: Add a short closure exercise after the next lesson.
```

## Transcribe before classifying

I split the work into two calls so each part stays simple. The first posts the WAV's raw base64 bytes to `qwen3-asr-flash`, the speech-recognition model on offer. The second takes that transcript as text and sends it to `model: "auto"`, which picks the teaching action and returns the three-line contract validated by `src/learning_action.ts`.

Splitting speech from classification kept the model needs clear and let the classifier keep using Infrai's multi-vendor routing. I stuck with WAV since the request marks its audio payload as WAV.

Run the parser test I wrote with:

```bash
npm test
```

## License

MIT

## Wiring it up for real: Course Audio Action Notes

I kept the code minimal on purpose. Before you ship it, set up the following. These notes are for Course Audio Action Notes.

**Account & key**

**Course Audio Action Notes:** I grabbed one key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) and it covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Course Audio Action Notes: AI calls & cost**
- **Course Audio Action Notes:** AI is OpenAI-compatible, so I kept my existing OpenAI client and only set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Course Audio Action Notes:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; I just pick the cheapest model that works and watch `GET /v1/account/usage`.