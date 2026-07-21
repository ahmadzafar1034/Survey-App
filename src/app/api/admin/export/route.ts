import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

function verifyToken(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [id, ts, sig] = parts;
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

// GET /api/admin/export — export all responses as CSV (Excel-compatible)
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

    const responses = await db.surveyResponse.findMany({
      orderBy: { submittedAt: "desc" },
    });

    // Build CSV
    const columns: { key: string; label: string }[] = [
      { key: "id", label: "Response ID" },
      { key: "submittedAt", label: "Submitted At" },
      { key: "ipAddress", label: "IP Address" },
      { key: "q1_3_name", label: "Name" },
      { key: "q1_4_age", label: "Age" },
      { key: "q1_5_gender", label: "Gender" },
      { key: "q1_1_university", label: "University (code)" },
      { key: "q1_1_university_other", label: "University (other)" },
      { key: "q1_2_field", label: "Field of Study (code)" },
      { key: "q1_2_field_other", label: "Field (other)" },
      { key: "q1_6_maritalStatus", label: "Marital Status (code)" },
      { key: "q1_7_semester", label: "Semester (code)" },
      { key: "q1_7_semester_other", label: "Semester (other)" },
      { key: "q1_8_residence", label: "Residence (code)" },
      { key: "q1_8_residence_other", label: "Residence (other)" },
      { key: "q1_9_disability", label: "Disability (code)" },
      { key: "q2_1_fatherEdu", label: "Father Education (code)" },
      { key: "q2_1_motherEdu", label: "Mother Education (code)" },
      { key: "q2_2_incomeSource", label: "Income Source (code)" },
      { key: "q2_3_housingStatus", label: "Housing Status (code)" },
      { key: "q2_4_siblings", label: "Siblings (code)" },
      { key: "q2_5_monthlyIncome", label: "Monthly Income (code)" },
      { key: "q3_1_intermediatePct", label: "Intermediate % (code)" },
      { key: "q3_2_uniChoiceReason", label: "Uni Choice Reason (code)" },
      { key: "q3_3_subjectReason", label: "Subject Reason (code)" },
      { key: "q3_4_satisfiedField", label: "Satisfied with Field (code)" },
      { key: "q4_classroom", label: "Q4 Classroom" },
      { key: "q4_library", label: "Q4 Library" },
      { key: "q4_lab", label: "Q4 Lab" },
      { key: "q4_computerLab", label: "Q4 Computer Lab" },
      { key: "q4_internet", label: "Q4 Internet" },
      { key: "q4_multimedia", label: "Q4 Multimedia" },
      { key: "q4_canteenHygiene", label: "Q4 Canteen Hygiene" },
      { key: "q4_canteenPrice", label: "Q4 Canteen Price" },
      { key: "q4_washrooms", label: "Q4 Washrooms" },
      { key: "q4_sports", label: "Q4 Sports" },
      { key: "q4_transport", label: "Q4 Transport" },
      { key: "q4_firstAid", label: "Q4 First Aid" },
      { key: "q5_1", label: "Q5.1 Syllabus up to date" },
      { key: "q5_2", label: "Q5.2 Practical knowledge" },
      { key: "q5_3", label: "Q5.3 Theory/practical balance" },
      { key: "q5_4", label: "Q5.4 Content coverable" },
      { key: "q5_5", label: "Q5.5 Workload manageable" },
      { key: "q5_6", label: "Q5.6 Exam fairness" },
      { key: "q5_7", label: "Q5.7 Grading transparency" },
      { key: "q5_8", label: "Q5.8 Internship access" },
      { key: "q5_9", label: "Q5.9 Research access" },
      { key: "q5_10", label: "Q5.10 Comfort seeking help" },
      { key: "q5_11", label: "Q5.11 Teacher impartiality" },
      { key: "q6_1_devices", label: "Q6.1 Devices (multi)" },
      { key: "q6_2_digitalConfident", label: "Q6.2 Digital Confidence (code)" },
      { key: "q6_3_software", label: "Q6.3 Software (multi)" },
      { key: "q6_4_softwareFreq", label: "Q6.4 Software Frequency (code)" },
      { key: "q6_5_aiTools", label: "Q6.5 AI Tools (multi)" },
      { key: "q6_6_aiPurpose", label: "Q6.6 AI Purpose (multi)" },
      { key: "q6_7_earnOnline", label: "Q6.7 Earn Online (code)" },
      { key: "q6_8_earnMethods", label: "Q6.8 Earn Methods (multi)" },
      { key: "q6_9_onlineIncome", label: "Q6.9 Online Income (code)" },
      { key: "q7_1_financer", label: "Q7.1 Financer (code)" },
      { key: "q7_2_tuitionFee", label: "Q7.2 Tuition Fee (code)" },
      { key: "q7_3_hasScholarship", label: "Q7.3 Has Scholarship (code)" },
      { key: "q7_4_scholarshipType", label: "Q7.4 Scholarship Type (code)" },
      { key: "q7_5_scholarshipPct", label: "Q7.5 Scholarship %" },
      { key: "q7_6_scholarshipImpact", label: "Q7.6 Scholarship Impact (code)" },
      { key: "q7_7_scholarshipInfo", label: "Q7.7 Scholarship Info (code)" },
      { key: "q7_8_financialDifficultyAffected", label: "Q7.8 Financial Diff (code)" },
      { key: "q7_9_expenseDifficulty", label: "Q7.9 Expense Diff (code)" },
      { key: "q8_1_physicalHealth", label: "Q8.1 Physical Health (code)" },
      { key: "q8_2_stressFreq", label: "Q8.2 Stress Freq (code)" },
      { key: "q8_3_sleepQuality", label: "Q8.3 Sleep Quality (code)" },
      { key: "q8_4_healthAffectsStudy", label: "Q8.4 Health Affects Study (code)" },
      { key: "q8_5_knowSupportSource", label: "Q8.5 Know Support Source (code)" },
      { key: "q8_6_healthAccess", label: "Q8.6 Health Access (code)" },
      { key: "q8_7_firstAidTraining", label: "Q8.7 First Aid Training (code)" },
      { key: "q8_8_firstAidCompulsory", label: "Q8.8 First Aid Compulsory (code)" },
      { key: "q9_1_internshipStatus", label: "Q9.1 Internship Status (code)" },
      { key: "q9_2_internshipCount", label: "Q9.2 Internship Count (code)" },
      { key: "q9_3_internshipRelevance", label: "Q9.3 Internship Relevance (code)" },
      { key: "q9_4_uniSupportRating", label: "Q9.4 Uni Support Rating (code)" },
      { key: "q9_5_careerEventsParticipated", label: "Q9.5 Career Events (code)" },
      { key: "q9_6_familyBusiness", label: "Q9.6 Family Business (code)" },
      { key: "q9_7_employabilityConfidence", label: "Q9.7 Employability Conf (code)" },
      { key: "q9_8_lackingSkills", label: "Q9.8 Lacking Skills (code)" },
      { key: "q10_1_decidedAfterGrad", label: "Q10.1 Decided After Grad (code)" },
      { key: "q10_2_primaryPlan", label: "Q10.2 Primary Plan (code)" },
      { key: "q10_3_preferredSector", label: "Q10.3 Preferred Sector (code)" },
      { key: "q10_4_careerInfluence", label: "Q10.4 Career Influence (code)" },
      { key: "q10_5_educationPrepCareer", label: "Q10.5 Education Prep Career (code)" },
      { key: "q10_6_biggestConcern", label: "Q10.6 Biggest Concern (code)" },
      { key: "q10_7_willingRelocate", label: "Q10.7 Willing Relocate (code)" },
      { key: "q10_8_careerSupport", label: "Q10.8 Career Support (code)" },
    ];

    // CSV escape
    const esc = (val: any): string => {
      if (val === null || val === undefined) return "";
      let s = String(val);
      // Format dates
      if (val instanceof Date) {
        s = val.toISOString();
      }
      if (/[",\n\r]/.test(s)) {
        s = `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const header = columns.map((c) => esc(c.label)).join(",");
    const rows = responses.map((r: any) =>
      columns.map((c) => esc(r[c.key])).join(",")
    );
    const csv = [header, ...rows].join("\r\n");

    // Add UTF-8 BOM for Excel compatibility
    const bom = "\uFEFF";
    const csvWithBom = bom + csv;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="survey-responses-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (err: any) {
    console.error("Admin export error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
