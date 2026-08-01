export type LearningAction = {
  transcript: string;
  action: "ANSWER" | "ADD_TO_LESSON" | "ASK_FOR_CLARIFICATION";
  note: string;
};

const allowedActions = new Set<LearningAction["action"]>([
  "ANSWER",
  "ADD_TO_LESSON",
  "ASK_FOR_CLARIFICATION",
]);

export function parseLearningAction(text: string): LearningAction {
  const fields = new Map<string, string>();
  for (const line of text.trim().split("\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) {
      fields.set(line.slice(0, separator).trim().toUpperCase(), line.slice(separator + 1).trim());
    }
  }

  const transcript = fields.get("TRANSCRIPT") ?? "";
  const action = fields.get("ACTION") ?? "";
  const note = fields.get("NOTE") ?? "";
  if (!transcript || !allowedActions.has(action as LearningAction["action"]) || !note) {
    throw new Error("The course action did not match the expected three-line format.");
  }
  return { transcript, action: action as LearningAction["action"], note };
}
