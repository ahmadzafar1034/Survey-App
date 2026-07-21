import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper: get client IP (best-effort)
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// POST /api/submit — submit a completed survey
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: Record<string, any> = body.answers || {};

    const data: any = {};

    const set = (key: string, column: string) => {
      const v = answers[key];
      if (v !== undefined && v !== null && v !== "") {
        data[column] = typeof v === "string" ? v.trim() : v;
      }
    };
    const setInt = (key: string, column: string) => {
      const v = answers[key];
      if (v !== undefined && v !== null && v !== "") {
        const n = Number(v);
        if (!Number.isNaN(n)) data[column] = n;
      }
    };
    const setArr = (key: string, column: string) => {
      const v = answers[key];
      if (Array.isArray(v) && v.length > 0) data[column] = v.join(",");
    };

    // Identification metadata (optional)
    set("processingCode", "processingCode");
    set("questionnaireId", "questionnaireId");
    set("dateOfSurvey", "dateOfSurvey");
    set("enumeratorId", "enumeratorId");
    data.screenedYes = answers.screenedYes !== false;

    // Section 1
    set("q1_1_university", "q1_1_university");
    set("q1_1_university_other", "q1_1_university_other");
    set("q1_2_field", "q1_2_field");
    set("q1_2_field_other", "q1_2_field_other");
    set("q1_3_name", "q1_3_name");
    setInt("q1_4_age", "q1_4_age");
    set("q1_5_gender", "q1_5_gender");
    set("q1_6_maritalStatus", "q1_6_maritalStatus");
    set("q1_7_semester", "q1_7_semester");
    set("q1_7_semester_other", "q1_7_semester_other");
    set("q1_8_residence", "q1_8_residence");
    set("q1_8_residence_other", "q1_8_residence_other");
    set("q1_9_disability", "q1_9_disability");

    // Section 2
    set("q2_1_fatherEdu", "q2_1_fatherEdu");
    set("q2_1_motherEdu", "q2_1_motherEdu");
    set("q2_1_edu_other", "q2_1_edu_other");
    set("q2_2_incomeSource", "q2_2_incomeSource");
    set("q2_2_income_other", "q2_2_income_other");
    set("q2_3_housingStatus", "q2_3_housingStatus");
    set("q2_3_housing_other", "q2_3_housing_other");
    set("q2_4_siblings", "q2_4_siblings");
    set("q2_5_monthlyIncome", "q2_5_monthlyIncome");

    // Section 3
    set("q3_1_intermediatePct", "q3_1_intermediatePct");
    set("q3_2_uniChoiceReason", "q3_2_uniChoiceReason");
    set("q3_3_subjectReason", "q3_3_subjectReason");
    set("q3_3_subject_other", "q3_3_subject_other");
    set("q3_4_satisfiedField", "q3_4_satisfiedField");

    // Section 4 (likert statements)
    [
      "q4_classroom", "q4_library", "q4_lab", "q4_computerLab",
      "q4_internet", "q4_multimedia", "q4_canteenHygiene", "q4_canteenPrice",
      "q4_washrooms", "q4_sports", "q4_transport", "q4_firstAid",
    ].forEach((k) => set(k, k));

    // Section 5 (likert)
    [
      "q5_1", "q5_2", "q5_3", "q5_4", "q5_5", "q5_6",
      "q5_7", "q5_8", "q5_9", "q5_10", "q5_11",
    ].forEach((k) => set(k, k));

    // Section 6
    setArr("q6_1_devices", "q6_1_devices");
    set("q6_1_devices_other", "q6_1_devices_other");
    set("q6_2_digitalConfident", "q6_2_digitalConfident");
    setArr("q6_3_software", "q6_3_software");
    set("q6_3_software_other", "q6_3_software_other");
    set("q6_4_softwareFreq", "q6_4_softwareFreq");
    setArr("q6_5_aiTools", "q6_5_aiTools");
    set("q6_5_aiTools_other", "q6_5_aiTools_other");
    setArr("q6_6_aiPurpose", "q6_6_aiPurpose");
    set("q6_6_aiPurpose_other", "q6_6_aiPurpose_other");
    set("q6_7_earnOnline", "q6_7_earnOnline");
    setArr("q6_8_earnMethods", "q6_8_earnMethods");
    set("q6_8_earn_other", "q6_8_earn_other");
    set("q6_9_onlineIncome", "q6_9_onlineIncome");

    // Section 7
    set("q7_1_financer", "q7_1_financer");
    set("q7_1_financer_other", "q7_1_financer_other");
    set("q7_2_tuitionFee", "q7_2_tuitionFee");
    set("q7_3_hasScholarship", "q7_3_hasScholarship");
    set("q7_4_scholarshipType", "q7_4_scholarshipType");
    set("q7_4_scholarship_other", "q7_4_scholarship_other");
    set("q7_5_scholarshipPct", "q7_5_scholarshipPct");
    set("q7_6_scholarshipImpact", "q7_6_scholarshipImpact");
    set("q7_7_scholarshipInfo", "q7_7_scholarshipInfo");
    set("q7_8_financialDifficultyAffected", "q7_8_financialDifficultyAffected");
    set("q7_9_expenseDifficulty", "q7_9_expenseDifficulty");

    // Section 8
    set("q8_1_physicalHealth", "q8_1_physicalHealth");
    set("q8_2_stressFreq", "q8_2_stressFreq");
    set("q8_3_sleepQuality", "q8_3_sleepQuality");
    set("q8_4_healthAffectsStudy", "q8_4_healthAffectsStudy");
    set("q8_5_knowSupportSource", "q8_5_knowSupportSource");
    set("q8_6_healthAccess", "q8_6_healthAccess");
    set("q8_7_firstAidTraining", "q8_7_firstAidTraining");
    set("q8_8_firstAidCompulsory", "q8_8_firstAidCompulsory");

    // Section 9
    set("q9_1_internshipStatus", "q9_1_internshipStatus");
    set("q9_2_internshipCount", "q9_2_internshipCount");
    set("q9_3_internshipRelevance", "q9_3_internshipRelevance");
    set("q9_4_uniSupportRating", "q9_4_uniSupportRating");
    set("q9_5_careerEventsParticipated", "q9_5_careerEventsParticipated");
    set("q9_6_familyBusiness", "q9_6_familyBusiness");
    set("q9_7_employabilityConfidence", "q9_7_employabilityConfidence");
    set("q9_8_lackingSkills", "q9_8_lackingSkills");

    // Section 10
    set("q10_1_decidedAfterGrad", "q10_1_decidedAfterGrad");
    set("q10_2_primaryPlan", "q10_2_primaryPlan");
    set("q10_2_plan_other", "q10_2_plan_other");
    set("q10_3_preferredSector", "q10_3_preferredSector");
    set("q10_3_sector_other", "q10_3_sector_other");
    set("q10_4_careerInfluence", "q10_4_careerInfluence");
    set("q10_4_influence_other", "q10_4_influence_other");
    set("q10_5_educationPrepCareer", "q10_5_educationPrepCareer");
    set("q10_6_biggestConcern", "q10_6_biggestConcern");
    set("q10_6_concern_other", "q10_6_concern_other");
    set("q10_7_willingRelocate", "q10_7_willingRelocate");
    set("q10_8_careerSupport", "q10_8_careerSupport");
    set("q10_8_support_other", "q10_8_support_other");

    // Meta
    data.ipAddress = getClientIp(req);
    data.userAgent = req.headers.get("user-agent") || "unknown";
    data.startedAt = answers._startedAt ? new Date(answers._startedAt) : new Date();
    data.submittedAt = new Date();

    const record = await db.surveyResponse.create({ data });

    return NextResponse.json({
      success: true,
      id: record.id,
      submittedAt: record.submittedAt,
    });
  } catch (err: any) {
    console.error("Survey submit error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
