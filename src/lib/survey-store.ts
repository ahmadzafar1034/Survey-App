"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SurveyAnswers = Record<string, any>;

export type SurveyStage =
  | "welcome"
  | "module1"
  | "module2"
  | "module3"
  | "module4"
  | "module5"
  | "module6"
  | "module7"
  | "module8"
  | "module9"
  | "module10"
  | "complete"
  | "admin-login"
  | "admin-dashboard";

type SurveyState = {
  stage: SurveyStage;
  answers: SurveyAnswers;
  startedAt: string | null;
  submittedAt: string | null;
  // admin auth
  adminToken: string | null;
  setStage: (stage: SurveyStage) => void;
  setAnswer: (key: string, value: any) => void;
  setMultiAnswer: (key: string, value: string[]) => void;
  clearAnswer: (key: string) => void;
  resetSurvey: () => void;
  markSubmitted: () => void;
  setAdminToken: (token: string | null) => void;
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      stage: "welcome",
      answers: {},
      startedAt: null,
      submittedAt: null,
      adminToken: null,
      setStage: (stage) => set({ stage }),
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
          startedAt: state.startedAt ?? new Date().toISOString(),
        })),
      setMultiAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
          startedAt: state.startedAt ?? new Date().toISOString(),
        })),
      clearAnswer: (key) =>
        set((state) => {
          const newAnswers = { ...state.answers };
          delete newAnswers[key];
          return { answers: newAnswers };
        }),
      resetSurvey: () =>
        set({
          stage: "welcome",
          answers: {},
          startedAt: null,
          submittedAt: null,
        }),
      markSubmitted: () =>
        set({ submittedAt: new Date().toISOString(), stage: "complete" }),
      setAdminToken: (token) => set({ adminToken: token }),
    }),
    {
      name: "usp-survey-2026",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        stage: state.stage,
        answers: state.answers,
        startedAt: state.startedAt,
        submittedAt: state.submittedAt,
        adminToken: state.adminToken,
      }),
    }
  )
);
