"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useSurveyStore } from "@/lib/survey-store";
import { toast } from "sonner";

export function WelcomePage() {
  const { answers, setAnswer, setStage, resetSurvey } = useSurveyStore();
  const [screening, setScreening] = useState<string>(answers.screenedYes === false ? "no" : answers.screenedYes === true ? "yes" : "");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleStart = () => {
    if (screening === "no") {
      toast.error("Sorry, this survey is only for registered Bachelor's (undergraduate) students.");
      return;
    }
    if (screening !== "yes") {
      toast.error("Please answer the screening question first.");
      return;
    }
    setAnswer("screenedYes", true);
    setAnswer("_startedAt", new Date().toISOString());
    setStage("module1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Survey Logo"
              className="h-12 w-auto bg-white/95 rounded p-1"
            />
            <div>
              <div className="text-sm font-semibold leading-tight">
                National Survey Team
              </div>
              <div className="text-xs opacity-80">
                Practical Survey Exercise
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => {
              setShowAdminLogin(true);
            }}
          >
            <Lock className="h-3.5 w-3.5 mr-1.5" /> Admin
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary to-[#0a2236] text-primary-foreground">
          <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-3 py-1 text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  Survey 2026 · Now Open
                </div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  University Student Profile, Learning Experience & Future
                  Aspirations Survey
                </h1>
                <p className="text-base opacity-90 leading-relaxed">
                  Your honest and thoughtful responses will help us understand
                  the real student experience and improve university policies
                  and services across the country.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm bg-primary-foreground/10 rounded-full px-3 py-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Anonymous & Confidential
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-primary-foreground/10 rounded-full px-3 py-1.5">
                    <HeartHandshake className="h-4 w-4" />
                    Voluntary Participation
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-primary-foreground/10 rounded-full px-3 py-1.5">
                    <GraduationCap className="h-4 w-4" />
                    ~10 minutes
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="Survey Logo"
                  className="max-h-72 w-auto bg-white/95 rounded-2xl p-6 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="container mx-auto max-w-4xl px-4 py-10 md:py-14 space-y-8">
          {/* Dear participant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Dear Participant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base leading-relaxed text-foreground/90">
              <p>
                You are invited to take part in this academic research survey.
                Your honest and thoughtful responses will help us understand the
                real student experience and improve university policies and
                services. Participation is completely voluntary and anonymous.
              </p>
              <p>
                All information you provide will be kept strictly confidential
                and used only in aggregate form for research purposes. You may
                skip any question you are not comfortable answering, and you may
                withdraw at any time.
              </p>
              <p>
                The survey is organized into <strong>10 short modules</strong>.
                You can move between modules using the Previous/Next buttons,
                and your progress is automatically saved on this device so you
                can resume later if needed.
              </p>
            </CardContent>
          </Card>

          {/* Survey overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Survey Overview</CardTitle>
              <CardDescription>
                The survey is divided into 10 modules covering different
                aspects of your university life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Student Profile",
                  "Family & Socio-Economic Background",
                  "Educational Journey",
                  "University Facilities & Learning Environment",
                  "Academic Challenges",
                  "Digital Skills & AI Usage",
                  "Financial Support & Scholarships",
                  "Health & Well-being",
                  "Employability & Internship",
                  "Career Aspirations",
                ].map((title, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="text-sm font-medium leading-tight pt-0.5">
                      {title}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Screening */}
          <Card className="border-primary/40 ring-1 ring-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Screening Question</CardTitle>
              <CardDescription>
                This survey is intended for currently registered Bachelor&apos;s
                (undergraduate) students only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-base font-medium">
                Are you currently a registered Bachelor&apos;s (undergraduate)
                student at any university?
              </div>
              <RadioGroup
                value={screening}
                onValueChange={setScreening}
                className="grid sm:grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="screen-yes"
                  className="survey-radio-card"
                  data-selected={screening === "yes"}
                >
                  <RadioGroupItem id="screen-yes" value="yes" />
                  <div>
                    <div className="font-medium">Yes</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      I am a currently registered undergraduate student.
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="screen-no"
                  className="survey-radio-card"
                  data-selected={screening === "no"}
                >
                  <RadioGroupItem id="screen-no" value="no" />
                  <div>
                    <div className="font-medium">No</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      I am not currently registered — survey will end.
                    </div>
                  </div>
                </Label>
              </RadioGroup>

              {screening === "no" && (
                <Alert>
                  <AlertDescription>
                    We appreciate your interest, but this survey is only for
                    currently registered Bachelor&apos;s (undergraduate)
                    students. Thank you for your time.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  By starting the survey, you consent to participate in this
                  research study.
                </div>
                <div className="flex gap-2">
                  {answers.screenedYes !== undefined && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (
                          confirm(
                            "This will clear your previous progress. Are you sure?"
                          )
                        ) {
                          resetSurvey();
                          setScreening("");
                          toast.success("Previous progress cleared.");
                        }
                      }}
                    >
                      Reset progress
                    </Button>
                  )}
                  <Button
                    size="lg"
                    onClick={handleStart}
                    disabled={screening !== "yes"}
                  >
                    Start Survey <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-4 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © 2026 National Survey Team · University Student Profile, Learning
          Experience & Future Aspirations Survey
        </div>
      </footer>

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
}

// ---------- Admin Login Modal ----------

function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const { setStage, setAdminToken } = useSurveyStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Login failed.");
        return;
      }
      setAdminToken(data.token);
      setStage("admin-dashboard");
      onClose();
      toast.success("Welcome, Administrator!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Administrator Login
          </DialogTitle>
          <DialogDescription>
            Sign in to access the survey dashboard and view submission
            statistics.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="u">Username</Label>
            <Input
              id="u"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Password</Label>
            <Input
              id="p"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="text-xs text-muted-foreground bg-secondary/50 rounded p-2 border border-border">
            <strong>Default credentials:</strong> admin / admin123
            <br />
            <span className="text-destructive">
              ⚠ Change this password after first login.
            </span>
          </div>
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
