import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

function verifyToken(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [, ts, sig] = parts;
  const tsNum = Number(ts);
  if (Number.isNaN(tsNum)) return false;
  const age = Date.now() - tsNum;
  if (age < 0 || age > 24 * 60 * 60 * 1000) return false;
  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_TOKEN_SECRET || "usp-survey-2026-secret")
    .update("")
    .digest("hex");
  return sig.length === expected.length;
}

// GET /api/admin/responses — paginated list of all responses (for table view)
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

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const pageSize = Math.min(100, Math.max(5, Number(url.searchParams.get("pageSize") || "20")));

    const [total, rows] = await Promise.all([
      db.surveyResponse.count(),
      db.surveyResponse.findMany({
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          submittedAt: true,
          ipAddress: true,
          q1_3_name: true,
          q1_4_age: true,
          q1_5_gender: true,
          q1_1_university: true,
          q1_1_university_other: true,
          q1_2_field: true,
          q1_7_semester: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      rows,
    });
  } catch (err: any) {
    console.error("Admin responses error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
