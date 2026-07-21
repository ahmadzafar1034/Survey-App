import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed-admin — one-time admin account setup
// Body: { username, password, secret }
// Secret must match process.env.ADMIN_SEED_SECRET or fallback "usp-survey-2026-seed"
// If an admin already exists, this endpoint refuses to run.
export async function POST(req: NextRequest) {
  try {
    const { username, password, secret } = await req.json();

    const expectedSecret = process.env.ADMIN_SEED_SECRET || "usp-survey-2026-seed";
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid seed secret." },
        { status: 403 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check if any admin already exists
    const existing = await db.adminUser.count();
    if (existing > 0) {
      // Allow updating existing admin if username matches (for password reset)
      const found = await db.adminUser.findUnique({ where: { username } });
      if (found) {
        const updated = await db.adminUser.update({
          where: { username },
          data: { password },
        });
        return NextResponse.json({
          success: true,
          message: "Admin password updated.",
          id: updated.id,
        });
      }
      return NextResponse.json(
        {
          success: false,
          error: "An admin account already exists. Use the existing username to reset its password.",
        },
        { status: 409 }
      );
    }

    const admin = await db.adminUser.create({
      data: { username, password },
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created.",
      id: admin.id,
    });
  } catch (err: any) {
    console.error("Seed admin error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
