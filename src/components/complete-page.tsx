"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useSurveyStore } from "@/lib/survey-store";
import { toast } from "sonner";

export function CompletePage() {
  const { answers, markSubmitted, setStage, resetSurvey, submittedAt } =
    useSurveyStore();
  const [submitting, setSubmitting] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit on mount — but only if not already submitted
  useEffect(() => {
    let cancelled = false;
    async function submit() {
      if (submittedAt) {
        setSubmitting(false);
        setSuccess(true);
        return;
      }
      setSubmitting(true);
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Submission failed");
        }
        if (!cancelled) {
          setSuccess(true);
          markSubmitted();
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Unknown error");
        }
      } finally {
        if (!cancelled) setSubmitting(false);
      }
    }
    submit();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRestart = () => {
    resetSurvey();
    setStage("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="text-lg font-medium">Submitting your responses…</div>
          <div className="text-sm text-muted-foreground">
            Please do not close or refresh this page.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">
              Submission Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              We couldn&apos;t submit your responses. This may be a network or
              server issue. Your answers are still saved on this device — you
              can retry below.
            </p>
            <pre className="text-xs bg-secondary p-2 rounded overflow-x-auto">
              {error}
            </pre>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setError(null);
                  setSubmitting(true);
                  // trigger useEffect re-run by toggling state
                  setTimeout(() => window.location.reload(), 500);
                }}
              >
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => setStage("module10")}
              >
                Back to last module
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="text-sm font-semibold">Survey 2026 — Submitted</div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center">
          <CardHeader>
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Thank you!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your survey responses have been successfully submitted. Thank you
              for your time and thoughtful answers — your input will help
              improve the university experience for students across the country.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm">
              <div className="font-medium mb-1">Submission details</div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>
                  Submitted at:{" "}
                  {submittedAt
                    ? new Date(submittedAt).toLocaleString()
                    : "—"}
                </div>
                <div>Survey: USP-2026 (v1.0)</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={handleRestart} variant="outline">
                <Home className="h-4 w-4 mr-1.5" /> Back to home
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              If you have any questions about this survey, please contact the
              National Survey Team.
            </p>
          </CardContent>
        </Card>
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
