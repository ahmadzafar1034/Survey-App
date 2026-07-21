"use client";

import { useSurveyStore } from "@/lib/survey-store";
import { WelcomePage } from "@/components/welcome-page";
import { SurveyModule } from "@/components/survey-module";
import { CompletePage } from "@/components/complete-page";
import { AdminDashboard } from "@/components/admin-dashboard";
import { useSyncExternalStore } from "react";

// Helper to read whether we're hydrated (client-only).
// Using useSyncExternalStore avoids the "setState in effect" lint warning
// while still protecting against hydration mismatches.
const emptySubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export default function Home() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const stage = useSurveyStore((s) => s.stage);
  const adminToken = useSurveyStore((s) => s.adminToken);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="text-sm text-muted-foreground">Loading survey…</div>
        </div>
      </div>
    );
  }

  // Admin-only routes
  if (stage === "admin-dashboard") {
    if (!adminToken) {
      return <WelcomePage />;
    }
    return <AdminDashboard />;
  }

  switch (stage) {
    case "welcome":
      return <WelcomePage />;
    case "module1":
      return <SurveyModule moduleId={1} />;
    case "module2":
      return <SurveyModule moduleId={2} />;
    case "module3":
      return <SurveyModule moduleId={3} />;
    case "module4":
      return <SurveyModule moduleId={4} />;
    case "module5":
      return <SurveyModule moduleId={5} />;
    case "module6":
      return <SurveyModule moduleId={6} />;
    case "module7":
      return <SurveyModule moduleId={7} />;
    case "module8":
      return <SurveyModule moduleId={8} />;
    case "module9":
      return <SurveyModule moduleId={9} />;
    case "module10":
      return <SurveyModule moduleId={10} />;
    case "complete":
      return <CompletePage />;
    default:
      return <WelcomePage />;
  }
}
