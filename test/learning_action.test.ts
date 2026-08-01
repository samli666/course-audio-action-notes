import assert from "node:assert/strict";
import test from "node:test";
import { parseLearningAction } from "../src/learning_action.ts";

test("keeps a learner question and its course action together", () => {
  const result = parseLearningAction(
    "TRANSCRIPT: Could you show another example of closures?\n" +
      "ACTION: ADD_TO_LESSON\n" +
      "NOTE: Add a short closure exercise after the next lesson.",
  );

  assert.equal(result.action, "ADD_TO_LESSON");
  assert.match(result.note, /closure exercise/);
});
