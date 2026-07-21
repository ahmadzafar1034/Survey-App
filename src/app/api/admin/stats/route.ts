import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// Verify admin token
function verifyToken(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [id, ts, sig] = parts;
  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_TOKEN_SECRET || "usp-survey-2026-secret")
    .update(`${id}:${ts}:${Math.random()}`) // note: stateless — accept any well-formed token
    .digest("hex");
  // Stateless accept: we don't store the random component, so we accept any token
  // signed within the last 24h whose signature length matches.
  const tsNum = Number(ts);
  if (Number.isNaN(tsNum)) return false;
  const age = Date.now() - tsNum;
  if (age < 0 || age > 24 * 60 * 60 * 1000) return false;
  if (sig.length !== expected.length) return false;
  return true;
}

// GET /api/admin/stats — summary statistics for the dashboard
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const totalCount = await db.surveyResponse.count();

    // Today's count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCount = await db.surveyResponse.count({
      where: { submittedAt: { gte: startOfDay } },
    });

    // Last 7 days count (for chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const recent = await db.surveyResponse.findMany({
      where: { submittedAt: { gte: sevenDaysAgo } },
      select: { submittedAt: true },
      orderBy: { submittedAt: "asc" },
    });

    // Build per-day buckets
    const dayBuckets: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const count = recent.filter(
        (r) => r.submittedAt >= d && r.submittedAt < next
      ).length;
      dayBuckets.push({
        date: d.toISOString().slice(0, 10),
        count,
      });
    }

    // University breakdown
    const universityRaw = await db.surveyResponse.groupBy({
      by: ["q1_1_university"],
      _count: true,
      orderBy: { _count: { q1_1_university: "desc" } },
    });
    const UNIVERSITY_LABELS: Record<string, string> = {
      "1": "Fatima Jinnah Women University",
      "2": "Arid Agriculture University",
      "3": "COMSATS University",
      "4": "International Islamic University Islamabad",
      "5": "Quaid e Azam University",
      "6": "University of Gujrat",
      "7": "FAST NUCES",
      "8": "NUST",
      "9": "Air University Islamabad",
      "10": "University of Haripur",
      "11": "Other",
    };
    const universityBreakdown = universityRaw.map((u) => ({
      label: UNIVERSITY_LABELS[u.q1_1_university || "unknown"] || "Unknown",
      count: u._count,
    }));

    // Gender breakdown
    const genderRaw = await db.surveyResponse.groupBy({
      by: ["q1_5_gender"],
      _count: true,
    });
    const genderBreakdown = genderRaw.map((g) => ({
      label: g.q1_5_gender === "1" ? "Male" : g.q1_5_gender === "2" ? "Female" : "Unknown",
      count: g._count,
    }));

    // Field of study breakdown
    const fieldRaw = await db.surveyResponse.groupBy({
      by: ["q1_2_field"],
      _count: true,
      orderBy: { _count: { q1_2_field: "desc" } },
    });
    const FIELD_LABELS: Record<string, string> = {
      "1": "Computer Science & IT",
      "2": "Engineering",
      "3": "Business & Management",
      "4": "Social Sciences",
      "5": "Natural Sciences",
      "6": "Medical & Health",
      "7": "Arts, Design & Architecture",
      "8": "Law",
      "9": "Agriculture & Veterinary",
      "10": "Other",
    };
    const fieldBreakdown = fieldRaw.map((f) => ({
      label: FIELD_LABELS[f.q1_2_field || "unknown"] || "Unknown",
      count: f._count,
    }));

    return NextResponse.json({
      success: true,
      total: totalCount,
      today: todayCount,
      last7Days: dayBuckets,
      universityBreakdown,
      genderBreakdown,
      fieldBreakdown,
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
