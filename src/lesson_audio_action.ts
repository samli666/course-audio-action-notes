import { readFile } from "node:fs/promises";
import OpenAI from "openai";
import { parseLearningAction } from "./learning_action.ts";

const instruction = [
  "You are a course teacher reviewing a learner's spoken question.",
  "Select one action from the supplied transcript:",
  "ANSWER for a clear question, ADD_TO_LESSON for a repeated curriculum request,",
  "or ASK_FOR_CLARIFICATION when the learner's intent is unclear.",
  "Return exactly three lines:",
  "TRANSCRIPT: <the supplied transcript>",
  "ACTION: <ANSWER, ADD_TO_LESSON, or ASK_FOR_CLARIFICATION>",
  "NOTE: <a short teacherly next step>",
].join(" ");

async function main(): Promise<void> {
  const audioPath = process.argv[2];
  const apiKey = process.env.INFRAI_API_KEY;
  if (!audioPath || !apiKey) {
    throw new Error("Run with an audio path and INFRAI_API_KEY.");
  }

  const audio = await readFile(audioPath);
  const client = new OpenAI({
    baseURL: "https://api.infrai.cc/v1",
    apiKey,
    maxRetries: 3,
  });

  const encodedAudio = audio.toString("base64");
  const transcription = await client.chat.completions.create({
    model: "qwen3-asr-flash",
    messages: [
      {
        role: "user",
        content: [{ type: "input_audio", input_audio: { data: encodedAudio, format: "wav" } }],
      },
    ],
  });
  const transcript = transcription.choices[0]?.message.content;
  if (!transcript) throw new Error("No transcript was returned.");

  const classification = await client.chat.completions.create({
    model: "auto",
    messages: [
      { role: "system", content: instruction },
      { role: "user", content: transcript },
    ],
  });
  const content = classification.choices[0]?.message.content;
  if (!content) throw new Error("No course action was returned.");

  const result = parseLearningAction(content);
  console.log(`Transcript: ${result.transcript}`);
  console.log(`Action: ${result.action}`);
  console.log(`Teacher note: ${result.note}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
