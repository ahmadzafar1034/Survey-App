import {
  MODULES,
  isQuestionVisible,
  getAutoFilledValue,
  type Question,
} from "./survey-data";

export type ValidationError = {
  key: string;
  message: string;
};

// Validate a single question against the current answers
export function validateQuestion(
  question: Question,
  answers: Record<string, any>
): ValidationError | null {
  const isVisible = isQuestionVisible(question.key, answers);

  // If question is hidden by skip-logic, never validate
  if (!isVisible) return null;

  // If auto-filled (e.g. Q10.3 when Q10.2 == 2 or 7), consider it valid
  const autoFilled = getAutoFilledValue(question.key, answers);
  if (autoFilled !== undefined) return null;

  const isRequired = question.required !== false; // default required
  const value = answers[question.key];

  switch (question.type) {
    case "single": {
      if (isRequired && !value) {
        return { key: question.key, message: "Please select an option." };
      }
      // If "Other" is selected (hasOther on the chosen option), check other text
      const chosenOpt = question.options.find((o) => o.value === value);
      if (chosenOpt?.hasOther) {
        const otherKey = `${question.key}_other`;
        const otherVal = answers[otherKey];
        if (!otherVal || !otherVal.trim()) {
          return {
            key: otherKey,
            message: "Please specify your answer in the 'Other' field.",
          };
        }
      }
      return null;
    }

    case "multi": {
      if (!Array.isArray(value)) {
        if (isRequired) {
          return { key: question.key, message: "Please select at least one option." };
        }
        return null;
      }
      if (isRequired && value.length === 0) {
        return { key: question.key, message: "Please select at least one option." };
      }
      if (question.minSelected && value.length < question.minSelected) {
        return {
          key: question.key,
          message: `Please select at least ${question.minSelected} option(s).`,
        };
      }
      if (question.maxSelected && value.length > question.maxSelected) {
        return {
          key: question.key,
          message: `Please select at most ${question.maxSelected} option(s).`,
        };
      }
      // If "Other" is selected, check other text
      const chosenOthers = question.options.filter(
        (o) => o.hasOther && value.includes(o.value)
      );
      for (const opt of chosenOthers) {
        const otherKey = `${question.key}_other`;
        const otherVal = answers[otherKey];
        if (!otherVal || !otherVal.trim()) {
          return {
            key: otherKey,
            message: "Please specify your answer in the 'Other' field.",
          };
        }
      }
      return null;
    }

    case "text": {
      const trimmed = (value || "").trim();
      if (isRequired && !trimmed) {
        return { key: question.key, message: "This field is required." };
      }
      if (trimmed && question.maxLength && trimmed.length > question.maxLength) {
        return {
          key: question.key,
          message: `Please keep it under ${question.maxLength} characters.`,
        };
      }
      return null;
    }

    case "number": {
      if (isRequired && (value === undefined || value === null || value === "")) {
        return { key: question.key, message: "Please enter a number." };
      }
      if (value !== undefined && value !== null && value !== "") {
        const num = Number(value);
        if (Number.isNaN(num)) {
          return { key: question.key, message: "Please enter a valid number." };
        }
        if (question.min !== undefined && num < question.min) {
          return {
            key: question.key,
            message: `Value must be at least ${question.min}.`,
          };
        }
        if (question.max !== undefined && num > question.max) {
          return {
            key: question.key,
            message: `Value must be at most ${question.max}.`,
          };
        }
      }
      return null;
    }

    case "likert": {
      if (isRequired) {
        for (const stmt of question.statements) {
          if (!answers[stmt.key]) {
            return {
              key: stmt.key,
              message: `Please rate: "${stmt.text.substring(0, 60)}${stmt.text.length > 60 ? "…" : ""}"`,
            };
          }
        }
      }
      return null;
    }
  }
}

// Validate an entire module
export function validateModule(
  moduleId: number,
  answers: Record<string, any>
): ValidationError[] {
  const surveyModule = MODULES.find((m) => m.id === moduleId);
  if (!surveyModule) return [];

  const errors: ValidationError[] = [];
  for (const q of surveyModule.questions) {
    const err = validateQuestion(q, answers);
    if (err) errors.push(err);
    // For likert, we already collect individual statement errors above
    if (q.type === "likert") {
      // collect errors for all statements in one pass
      const isRequired = q.required !== false;
      if (isRequired) {
        for (const stmt of q.statements) {
          if (isQuestionVisible(stmt.key, answers) && !answers[stmt.key]) {
            if (!errors.find((e) => e.key === stmt.key)) {
              errors.push({
                key: stmt.key,
                message: `Please rate: "${stmt.text.substring(0, 60)}${stmt.text.length > 60 ? "…" : ""}"`,
              });
            }
          }
        }
      }
    }
  }
  return errors;
}
