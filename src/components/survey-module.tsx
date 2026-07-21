"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useSurveyStore } from "@/lib/survey-store";
import {
  MODULES,
  isQuestionVisible,
  getAutoFilledValue,
  type Question,
} from "@/lib/survey-data";
import { validateModule } from "@/lib/survey-validation";
import { toast } from "sonner";

// ----- Single-choice question -----
function SingleChoiceQuestion({
  question,
  answer,
  otherAnswer,
  onAnswer,
  onOtherAnswer,
  error,
}: {
  question: Extract<Question, { type: "single" }>;
  answer?: string;
  otherAnswer?: string;
  onAnswer: (v: string) => void;
  onOtherAnswer: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {question.options.map((opt) => {
          const selected = answer === opt.value;
          return (
            <div key={opt.value}>
              <label
                className="survey-radio-card"
                data-selected={selected}
                onClick={() => onAnswer(opt.value)}
              >
                <input
                  type="radio"
                  name={question.key}
                  value={opt.value}
                  checked={selected}
                  onChange={() => onAnswer(opt.value)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium leading-tight">{opt.label}</div>
                  {opt.note && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      {opt.note}
                    </div>
                  )}
                </div>
              </label>
              {selected && opt.hasOther && (
                <Input
                  className="mt-2 ml-7 max-w-md"
                  placeholder="Please specify..."
                  value={otherAnswer || ""}
                  onChange={(e) => onOtherAnswer(e.target.value)}
                  aria-label={`${question.key} other specification`}
                />
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}

// ----- Multi-choice question -----
function MultiChoiceQuestion({
  question,
  answer,
  otherAnswer,
  onAnswer,
  onOtherAnswer,
  error,
}: {
  question: Extract<Question, { type: "multi" }>;
  answer: string[];
  otherAnswer?: string;
  onAnswer: (v: string[]) => void;
  onOtherAnswer: (v: string) => void;
  error?: string;
}) {
  const selected = Array.isArray(answer) ? answer : [];
  const noneOption = question.options.find((o) =>
    /none of the above|not used|no$/i.test(o.label)
  );

  const toggle = (val: string, hasOther?: boolean) => {
    // If selecting "None"-style option, clear others; if selecting other, clear "None"
    let next: string[];
    if (selected.includes(val)) {
      next = selected.filter((v) => v !== val);
    } else {
      if (noneOption && val === noneOption.value) {
        next = [val];
      } else if (noneOption) {
        next = [...selected.filter((v) => v !== noneOption.value), val];
      } else {
        next = [...selected, val];
      }
    }
    onAnswer(next);
    if (!next.includes(val) && hasOther) {
      onOtherAnswer("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <div key={opt.value}>
              <label
                className="survey-checkbox-card"
                data-selected={isSelected}
                onClick={(e) => {
                  e.preventDefault();
                  toggle(opt.value, opt.hasOther);
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggle(opt.value, opt.hasOther)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium leading-tight">{opt.label}</div>
                  {opt.note && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      {opt.note}
                    </div>
                  )}
                </div>
              </label>
              {isSelected && opt.hasOther && (
                <Input
                  className="mt-2 ml-7 max-w-md"
                  placeholder="Please specify..."
                  value={otherAnswer || ""}
                  onChange={(e) => onOtherAnswer(e.target.value)}
                  aria-label={`${question.key} other specification`}
                />
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}

// ----- Text question -----
function TextQuestion({
  question,
  answer,
  onAnswer,
  error,
}: {
  question: Extract<Question, { type: "text" }>;
  answer?: string;
  onAnswer: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Input
        placeholder={question.placeholder}
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        maxLength={question.maxLength}
        aria-label={question.label}
      />
      {question.maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {(answer || "").length}/{question.maxLength}
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}

// ----- Number question -----
function NumberQuestion({
  question,
  answer,
  onAnswer,
  error,
}: {
  question: Extract<Question, { type: "number" }>;
  answer?: string | number;
  onAnswer: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Input
        type="number"
        inputMode="numeric"
        placeholder={question.placeholder}
        value={answer ?? ""}
        onChange={(e) => onAnswer(e.target.value)}
        min={question.min}
        max={question.max}
        aria-label={question.label}
      />
      {question.help && (
        <p className="text-xs text-muted-foreground">{question.help}</p>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}

// ----- Likert matrix -----
function LikertQuestion({
  question,
  answers,
  onAnswer,
  errors,
}: {
  question: Extract<Question, { type: "likert" }>;
  answers: Record<string, any>;
  onAnswer: (key: string, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto -mx-2">
        <div className="min-w-[640px] px-2">
          {/* Header row */}
          <div
            className="grid gap-2 mb-2 sticky top-0 z-10"
            style={{ gridTemplateColumns: `minmax(280px, 2fr) repeat(${question.scale.length}, 1fr)` }}
          >
            <div className="text-sm font-semibold text-muted-foreground p-2">
              Statement
            </div>
            {question.scale.map((s) => (
              <div
                key={s.value}
                className="text-xs font-semibold text-center p-2 text-muted-foreground"
              >
                {s.value}
                <div className="text-[10px] font-normal leading-tight mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          {/* Statement rows */}
          {question.statements.map((stmt, idx) => {
            const current = answers[stmt.key];
            const err = errors[stmt.key];
            return (
              <div
                key={stmt.key}
                className={`grid gap-2 items-stretch mb-1 rounded-md p-1 ${
                  idx % 2 === 0 ? "bg-secondary/40" : "bg-transparent"
                } ${err ? "ring-2 ring-destructive/50" : ""}`}
                style={{ gridTemplateColumns: `minmax(280px, 2fr) repeat(${question.scale.length}, 1fr)` }}
              >
                <div className="text-sm p-2 flex items-center leading-tight">
                  {stmt.text}
                </div>
                {question.scale.map((s) => {
                  const selected = current === s.value;
                  return (
                    <div
                      key={s.value}
                      className="likert-cell"
                      data-selected={selected}
                      onClick={() => onAnswer(stmt.key, s.value)}
                      title={`${s.value} — ${s.label}`}
                    >
                      <span className="text-sm">{s.value}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-destructive flex items-center gap-1.5 mt-2">
          <AlertCircle className="h-4 w-4" /> Please rate all statements above.
        </p>
      )}
    </div>
  );
}

// ----- Question renderer -----
function QuestionRenderer({
  question,
  answers,
  errors,
  onAnswer,
}: {
  question: Question;
  answers: Record<string, any>;
  errors: Record<string, string>;
  onAnswer: (key: string, value: any) => void;
}) {
  const isVisible = isQuestionVisible(question.key, answers);
  if (!isVisible) return null;

  // Check if this question is currently auto-filled by skip logic
  const autoFilled = getAutoFilledValue(question.key, answers);
  const isAutoFilled = autoFilled !== undefined && answers[question.key] === autoFilled;

  // Handle answer with auto-fill cascading (for Q10.2 -> Q10.3 dependency)
  const handleAnswer = (key: string, value: any) => {
    onAnswer(key, value);
    // Cascade: when Q10.2 is set to "2" or "7", auto-set Q10.3 to "9"
    if (key === "q10_2_primaryPlan" && (value === "2" || value === "7")) {
      onAnswer("q10_3_preferredSector", "9");
    }
    // If user changes Q10.2 away from those values, clear Q10.3 if it was auto-set
    if (key === "q10_2_primaryPlan" && value !== "2" && value !== "7") {
      if (answers.q10_3_preferredSector === "9") {
        onAnswer("q10_3_preferredSector", "");
      }
    }
  };

  // For auto-filled single questions, render as read-only with explanation
  if (isAutoFilled && question.type === "single") {
    const chosenOpt = question.options.find((o) => o.value === autoFilled);
    return (
      <div className="space-y-3">
        <div className="survey-radio-card" data-selected={true} style={{ opacity: 0.85 }}>
          <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-primary" />
          <div className="flex-1 min-w-0">
            <div className="font-medium leading-tight">{chosenOpt?.label}</div>
            <div className="text-xs text-muted-foreground mt-1 italic">
              Auto-selected based on your answer to the previous question.
            </div>
          </div>
        </div>
      </div>
    );
  }

  switch (question.type) {
    case "single":
      return (
        <SingleChoiceQuestion
          question={question}
          answer={answers[question.key]}
          otherAnswer={answers[`${question.key}_other`]}
          onAnswer={(v) => handleAnswer(question.key, v)}
          onOtherAnswer={(v) => onAnswer(`${question.key}_other`, v)}
          error={errors[question.key] || errors[`${question.key}_other`]}
        />
      );
    case "multi":
      return (
        <MultiChoiceQuestion
          question={question}
          answer={answers[question.key] || []}
          otherAnswer={answers[`${question.key}_other`]}
          onAnswer={(v) => onAnswer(question.key, v)}
          onOtherAnswer={(v) => onAnswer(`${question.key}_other`, v)}
          error={errors[question.key] || errors[`${question.key}_other`]}
        />
      );
    case "text":
      return (
        <TextQuestion
          question={question}
          answer={answers[question.key]}
          onAnswer={(v) => onAnswer(question.key, v)}
          error={errors[question.key]}
        />
      );
    case "number":
      return (
        <NumberQuestion
          question={question}
          answer={answers[question.key]}
          onAnswer={(v) => onAnswer(question.key, v)}
          error={errors[question.key]}
        />
      );
    case "likert":
      return (
        <LikertQuestion
          question={question}
          answers={answers}
          onAnswer={(k, v) => onAnswer(k, v)}
          errors={errors}
        />
      );
  }
}

// ----- Module page -----
export function SurveyModule({ moduleId }: { moduleId: number }) {
  const { answers, setAnswer, setStage } = useSurveyStore();
  const [showErrors, setShowErrors] = useState(false);

  const mod = useMemo(() => MODULES.find((m) => m.id === moduleId)!, [moduleId]);

  // Progress calculation: this module is moduleId of 10
  const progressPercent = ((moduleId - 1) / 10) * 100;

  // Compute errors live during render — only if user has clicked Next at least once
  // This avoids setState-in-effect warnings and gives instant feedback as users fix errors.
  const errors: Record<string, string> = useMemo(() => {
    if (!showErrors) return {};
    const errs = validateModule(moduleId, answers);
    const errMap: Record<string, string> = {};
    errs.forEach((e) => (errMap[e.key] = e.message));
    return errMap;
  }, [showErrors, moduleId, answers]);

  const handleAnswer = (key: string, value: any) => {
    setAnswer(key, value);
  };

  const goPrev = () => {
    if (moduleId > 1) {
      setStage(`module${moduleId - 1}` as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("welcome");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => {
    const errs = validateModule(moduleId, answers);
    if (errs.length > 0) {
      setShowErrors(true);
      toast.error(`Please fix ${errs.length} item(s) before continuing.`);
      // Scroll to first error
      setTimeout(() => {
        const firstErrKey = errs[0].key;
        const el = document.querySelector(`[data-q-key="${firstErrKey}"]`) as HTMLElement | null;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    setShowErrors(false);
    if (moduleId < 10) {
      setStage(`module${moduleId + 1}` as any);
    } else {
      setStage("complete");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo and progress */}
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="container mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Survey Logo"
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <div className="text-sm font-semibold leading-tight">
                  Student Survey 2026
                </div>
                <div className="text-xs text-muted-foreground">
                  National Survey Team
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                Module {moduleId} / 10
              </Badge>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progressPercent + 10} className="h-1.5" />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{mod.title}</h1>
          <p className="text-muted-foreground mt-1">{mod.description}</p>
        </div>

        <div className="space-y-8">
          {mod.questions.map((q) => {
            // Skip if not visible
            if (!isQuestionVisible(q.key, answers)) return null;

            // For likert, we have one "card" with all statements
            if (q.type === "likert") {
              const likertErrs: Record<string, string> = {};
              for (const stmt of q.statements) {
                if (errors[stmt.key]) likertErrs[stmt.key] = errors[stmt.key];
              }
              return (
                <Card key={q.key} data-q-key={q.key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{q.label}</CardTitle>
                    {q.help && (
                      <CardDescription>{q.help}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <LikertQuestion
                      question={q as any}
                      answers={answers}
                      onAnswer={handleAnswer}
                      errors={likertErrs}
                    />
                  </CardContent>
                </Card>
              );
            }

            // For non-likert questions
            return (
              <Card key={q.key} data-q-key={q.key} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold leading-tight">
                    {q.label}
                  </CardTitle>
                  {q.help && (
                    <CardDescription className="text-xs">
                      {q.help}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <QuestionRenderer
                    question={q}
                    answers={answers}
                    errors={errors}
                    onAnswer={handleAnswer}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={goPrev} size="lg">
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="text-xs text-muted-foreground hidden sm:block">
            Your progress is saved automatically on this device.
          </div>
          <Button onClick={goNext} size="lg">
            {moduleId === 10 ? "Review & Submit" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-4 mt-auto">
        <div className="container mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          © 2026 National Survey Team · University Student Profile, Learning
          Experience & Future Aspirations Survey
        </div>
      </footer>
    </div>
  );
}
