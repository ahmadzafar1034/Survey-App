import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// Simple constant-time string compare to avoid timing attacks
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// POST /api/admin/login
// Body: { username, password }
// Returns: { success, token } on success
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await db.adminUser.findUnique({
      where: { username: String(username).trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Verify password.
    // For this scaffold, the seeded admin stores passwords in plain text.
    // For production, swap this for bcrypt.compare() with hashed passwords.
    let valid = false;
    if (admin.password.startsWith("$2")) {
      // Bcrypt hash — install bcryptjs and replace the line below with:
      //   const bcrypt = await import("bcryptjs");
      //   valid = await bcrypt.default.compare(String(password), admin.password);
      valid = false;
    } else {
      // Plain text fallback (dev/seed only)
      valid = safeEqual(admin.password, String(password));
    }

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Issue a simple token (signed-style hash)
    const tokenPayload = `${admin.id}:${Date.now()}:${Math.random()}`;
    const token = crypto
      .createHmac("sha256", process.env.ADMIN_TOKEN_SECRET || "usp-survey-2026-secret")
      .update(tokenPayload)
      .digest("hex");

    // Token is stateless; we encode id + ts + signature
    const fullToken = `${admin.id}.${Date.now()}.${token}`;
    return NextResponse.json({ success: true, token: fullToken, username: admin.username });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
