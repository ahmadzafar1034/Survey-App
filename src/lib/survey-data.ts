// Survey definition — all questions, options, and skip logic
// This is the single source of truth for the entire questionnaire.

export type QuestionOption = {
  value: string;
  label: string;
  hasOther?: boolean; // whether to show "Other" text input
  note?: string; // small note shown under the option
};

export type LikertStatement = {
  key: string;
  text: string;
};

// ---- Shared option lists (declared BEFORE MODULES to avoid TDZ) ----
export const EDUCATION_OPTIONS: QuestionOption[] = [
  { value: "1", label: "Never attended school" },
  { value: "2", label: "Primary" },
  { value: "3", label: "Middle" },
  { value: "4", label: "Matriculation / O Levels / Secondary level" },
  { value: "5", label: "Intermediate / A Levels / Higher Secondary level" },
  { value: "6", label: "BA / BSc (2-year or 3-year Bachelor's Degree)" },
  { value: "7", label: "B.Ed." },
  { value: "8", label: "B.Com" },
  { value: "9", label: "MBBS / BDS / Pharm-D" },
  { value: "10", label: "MA / MSc (2-year Master's Degree)" },
  { value: "11", label: "BS / BE (4-year Bachelor's Degree)" },
  { value: "12", label: "M.Ed." },
  { value: "13", label: "M.Phil. / MS" },
  { value: "14", label: "Ph.D." },
  { value: "15", label: "Other", hasOther: true },
];

export const LIKERT_5: QuestionOption[] = [
  { value: "1", label: "Strongly Disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly Agree" },
];

export const UNIVERSITY_OPTIONS: QuestionOption[] = [
  { value: "1", label: "Fatima Jinnah Women University" },
  { value: "2", label: "Arid Agriculture University" },
  { value: "3", label: "COMSATS University" },
  { value: "4", label: "International Islamic University Islamabad" },
  { value: "5", label: "Quaid e Azam University" },
  { value: "6", label: "University of Gujrat" },
  { value: "7", label: "FAST NUCES" },
  { value: "8", label: "National University of Sciences and Technology" },
  { value: "9", label: "Air University Islamabad" },
  { value: "10", label: "University of Haripur" },
  { value: "11", label: "Other", hasOther: true },
];

export const FIELD_OPTIONS: QuestionOption[] = [
  { value: "1", label: "Computer Science & IT", note: "CS, Software Engineering, IT, Data Science, Data Analytics, AI, Bioinformatics" },
  { value: "2", label: "Engineering", note: "Civil, Electrical, Chemical, Mechanical, Bio-Medical, Aerospace, Telecommunication" },
  { value: "3", label: "Business & Management", note: "BBA, Accounting & Finance, Economics" },
  { value: "4", label: "Social Sciences", note: "Psychology, Education, English, Mass Comm, IR, Sociology" },
  { value: "5", label: "Natural Sciences", note: "Physics, Chemistry, Math, Statistics, Biology, Environmental Science" },
  { value: "6", label: "Medical & Health", note: "MBBS, DPT, Pharmacy, Nursing, Nutrition" },
  { value: "7", label: "Arts, Design & Architecture" },
  { value: "8", label: "Law" },
  { value: "9", label: "Agriculture & Veterinary" },
  { value: "10", label: "Other", hasOther: true },
];

export type Question =
  | {
      type: "single";
      key: string;
      label: string;
      help?: string;
      options: QuestionOption[];
      required?: boolean;
    }
  | {
      type: "multi";
      key: string;
      label: string;
      help?: string;
      options: QuestionOption[];
      required?: boolean;
      minSelected?: number;
      maxSelected?: number;
    }
  | {
      type: "text";
      key: string;
      label: string;
      help?: string;
      placeholder?: string;
      required?: boolean;
      maxLength?: number;
    }
  | {
      type: "number";
      key: string;
      label: string;
      help?: string;
      placeholder?: string;
      required?: boolean;
      min?: number;
      max?: number;
    }
  | {
      type: "likert";
      key: string;
      label: string;
      help?: string;
      statements: LikertStatement[];
      scale: QuestionOption[]; // 1..5 typically
      required?: boolean;
    };

export const MODULES: {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  questions: Question[];
}[] = [
  // ============ SECTION 1 ============
  {
    id: 1,
    title: "Section 1: Student Profile",
    shortTitle: "Student Profile",
    description: "Basic information about you and your enrollment.",
    questions: [
      {
        type: "single",
        key: "q1_1_university",
        label: "1.1 Which university are you currently enrolled in?",
        options: UNIVERSITY_OPTIONS,
        required: true,
      },
      {
        type: "single",
        key: "q1_2_field",
        label: "1.2 What is your field of study / degree program?",
        options: FIELD_OPTIONS,
        required: true,
      },
      {
        type: "text",
        key: "q1_3_name",
        label: "1.3 What is your name?",
        placeholder: "Enter your full name",
        required: true,
        maxLength: 100,
      },
      {
        type: "number",
        key: "q1_4_age",
        label: "1.4 What is your age (in completed years)?",
        placeholder: "e.g. 21",
        required: true,
        min: 16,
        max: 60,
      },
      {
        type: "single",
        key: "q1_5_gender",
        label: "1.5 What is your gender?",
        options: [
          { value: "1", label: "Male" },
          { value: "2", label: "Female" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q1_6_maritalStatus",
        label: "1.6 What is your current marital status?",
        options: [
          { value: "1", label: "Never Married / Single" },
          { value: "2", label: "Married" },
          { value: "3", label: "Widow / Widower" },
          { value: "4", label: "Divorced" },
          { value: "5", label: "Separated" },
          { value: "6", label: "Nikah solemnized, Rukhsati pending" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q1_7_semester",
        label: "1.7 What is your current semester?",
        options: [
          { value: "1", label: "1st Semester" },
          { value: "2", label: "2nd Semester" },
          { value: "3", label: "3rd Semester" },
          { value: "4", label: "4th Semester" },
          { value: "5", label: "5th Semester" },
          { value: "6", label: "6th Semester" },
          { value: "7", label: "7th Semester" },
          { value: "8", label: "8th Semester" },
          { value: "9", label: "9th Semester" },
          { value: "10", label: "10th Semester" },
          { value: "11", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q1_8_residence",
        label: "1.8 Current Residential Status",
        options: [
          { value: "1", label: "Day scholar" },
          { value: "2", label: "University hostel" },
          { value: "3", label: "Private hostel / rented accommodation" },
          { value: "4", label: "Living with relatives / friends" },
          { value: "5", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q1_9_disability",
        label: "1.9 Do you have any disability?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "3", label: "Prefer not to say" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 2 ============
  {
    id: 2,
    title: "Section 2: Family & Socio-Economic Background",
    shortTitle: "Family Background",
    description: "Information about your family and household.",
    questions: [
      {
        type: "single",
        key: "q2_1_fatherEdu",
        label: "2.1a What is the highest educational qualification of your Father?",
        options: EDUCATION_OPTIONS,
        required: true,
      },
      {
        type: "single",
        key: "q2_1_motherEdu",
        label: "2.1b What is the highest educational qualification of your Mother?",
        options: EDUCATION_OPTIONS,
        required: true,
      },
      {
        type: "single",
        key: "q2_2_incomeSource",
        label: "2.2 What is your family's primary source of income?",
        options: [
          { value: "1", label: "Government employment" },
          { value: "2", label: "Private employment" },
          { value: "3", label: "Business / Self-employed" },
          { value: "4", label: "Agriculture / Farming" },
          { value: "5", label: "Daily wage labor" },
          { value: "6", label: "Pension" },
          { value: "7", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q2_3_housingStatus",
        label: "2.3 What is your family's housing status?",
        options: [
          { value: "1", label: "Own house" },
          { value: "2", label: "Hiring" },
          { value: "3", label: "Govt accommodation" },
          { value: "4", label: "Rented house" },
          { value: "5", label: "Living with relative / friend / rent-free" },
          { value: "6", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q2_4_siblings",
        label: "2.4 How many siblings do you have?",
        options: [
          { value: "0", label: "0" },
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4 or more" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q2_5_monthlyIncome",
        label: "2.5 What is your total monthly household income?",
        options: [
          { value: "1", label: "Less than Rs. 50,000" },
          { value: "2", label: "Rs. 50,000 – Rs. 99,999" },
          { value: "3", label: "Rs. 100,000 – Rs. 199,999" },
          { value: "4", label: "Rs. 200,000 – Rs. 299,999" },
          { value: "5", label: "Rs. 300,000 – Rs. 499,999" },
          { value: "6", label: "Rs. 500,000 – Rs. 699,999" },
          { value: "7", label: "Rs. 700,000 – Rs. 999,999" },
          { value: "8", label: "Rs. 1,000,000 or more" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 3 ============
  {
    id: 3,
    title: "Section 3: Educational Journey",
    shortTitle: "Educational Journey",
    description: "Your academic background and reasons for your choices.",
    questions: [
      {
        type: "single",
        key: "q3_1_intermediatePct",
        label: "3.1 What was your percentage in Intermediate (HSSC / A-level)?",
        options: [
          { value: "1", label: "Below 50%" },
          { value: "2", label: "50% – 59%" },
          { value: "3", label: "60% – 69%" },
          { value: "4", label: "70% – 79%" },
          { value: "5", label: "80% and above" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q3_2_uniChoiceReason",
        label: "3.2 Why did you choose this university?",
        options: [
          { value: "1", label: "By your own choice" },
          { value: "2", label: "By parents' choice" },
          { value: "3", label: "By a friend's choice" },
          { value: "4", label: "Good reputation" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q3_3_subjectReason",
        label: "3.3 Reason for choosing current subject:",
        options: [
          { value: "1", label: "Personal interest" },
          { value: "2", label: "More career options" },
          { value: "3", label: "Parents' choice" },
          { value: "4", label: "Teacher's / counsellor choice" },
          { value: "5", label: "By relative / friend's choice" },
          { value: "6", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q3_4_satisfiedField",
        label: "3.4 Are you satisfied with chosen field?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 4 ============
  {
    id: 4,
    title: "Section 4: University Facilities & Learning Environment",
    shortTitle: "University Facilities",
    description: "Rate your satisfaction with various university facilities (1 = Strongly Disagree, 5 = Strongly Agree).",
    questions: [
      {
        type: "likert",
        key: "q4",
        label: "4.1 How satisfied are you with the following university facilities and services?",
        help: "Indicate your level of agreement with each statement by selecting the appropriate option.",
        scale: LIKERT_5,
        required: true,
        statements: [
          { key: "q4_classroom", text: "Classroom environment (seating, lighting, ventilation) is comfortable." },
          { key: "q4_library", text: "Library resources / study spaces are adequate." },
          { key: "q4_lab", text: "Laboratory facilities support practical learning." },
          { key: "q4_computerLab", text: "Computer labs are equipped with necessary hardware / software." },
          { key: "q4_internet", text: "Internet / Wi-Fi services meet academic needs." },
          { key: "q4_multimedia", text: "Multimedia facilities (projectors, smartboards) function effectively." },
          { key: "q4_canteenHygiene", text: "The canteen provides hygienic / quality food." },
          { key: "q4_canteenPrice", text: "Food and beverages in the canteen are reasonably priced." },
          { key: "q4_washrooms", text: "Washrooms are clean, functional / properly maintained." },
          { key: "q4_sports", text: "Sports and recreational facilities are accessible." },
          { key: "q4_transport", text: "University transport services are safe / reliable." },
          { key: "q4_firstAid", text: "First aid and medical services are available when required." },
        ],
      },
    ],
  },

  // ============ SECTION 5 ============
  {
    id: 5,
    title: "Section 5: Academic Challenges",
    shortTitle: "Academic Challenges",
    description: "Your views on curriculum, workload, and academic fairness (1 = Strongly Disagree, 5 = Strongly Agree).",
    questions: [
      {
        type: "likert",
        key: "q5",
        label: "Please indicate your level of agreement with each statement below.",
        scale: LIKERT_5,
        required: true,
        statements: [
          { key: "q5_1", text: "5.1 The syllabus taught in my program is up to date." },
          { key: "q5_2", text: "5.2 The curriculum provides sufficient practical knowledge / skills." },
          { key: "q5_3", text: "5.3 The curriculum maintains a balanced focus between theory and practical work." },
          { key: "q5_4", text: "5.4 The amount of content in the syllabus can be reasonably covered within a single semester." },
          { key: "q5_5", text: "5.5 The overall academic workload is manageable for students." },
          { key: "q5_6", text: "5.6 The examination format fairly tests what is actually taught in class." },
          { key: "q5_7", text: "5.7 The grading process at my university is transparent / consistent." },
          { key: "q5_8", text: "5.8 Students have equal access to internship opportunities." },
          { key: "q5_9", text: "5.9 Students have equal access to research project opportunities." },
          { key: "q5_10", text: "5.10 Students feel comfortable seeking academic help from their teachers." },
          { key: "q5_11", text: "5.11 Teachers treat all students impartially / fairly throughout their academic experience." },
        ],
      },
    ],
  },

  // ============ SECTION 6 ============
  {
    id: 6,
    title: "Section 6: Digital Skills & AI Usage",
    shortTitle: "Digital Skills & AI",
    description: "Your digital device ownership, software use, and AI tool usage.",
    questions: [
      {
        type: "multi",
        key: "q6_1_devices",
        label: "6.1 Which of the following digital devices do you own or have regular access to?",
        options: [
          { value: "1", label: "Laptop" },
          { value: "2", label: "Desktop computer" },
          { value: "3", label: "Smartphone" },
          { value: "4", label: "Tablet / iPad" },
          { value: "5", label: "None of the above" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q6_2_digitalConfident",
        label: "6.2 How confident are you in using digital devices for your academic work?",
        options: [
          { value: "1", label: "Not at all confident" },
          { value: "2", label: "Slightly confident" },
          { value: "3", label: "Moderately confident" },
          { value: "4", label: "Very confident" },
          { value: "5", label: "Extremely confident" },
        ],
        required: true,
      },
      {
        type: "multi",
        key: "q6_3_software",
        label: "6.3 Which of the following digital tools / software do you use?",
        options: [
          { value: "1", label: "Microsoft Office (Word, Excel, PowerPoint)" },
          { value: "2", label: "Google Workspace (Docs, Sheets, Slides)" },
          { value: "3", label: "Statistical software (SPSS, R, Stata, etc.)" },
          { value: "4", label: "Programming languages (Python, SQL, MATLAB, etc.)" },
          { value: "5", label: "LaTeX" },
          { value: "6", label: "Online collaboration tools (Zoom, Google Meet, Microsoft Teams)" },
          { value: "7", label: "Graphic design tools (Canva, Photoshop, Illustrator, etc.)" },
          { value: "8", label: "None of the above" },
          { value: "9", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q6_4_softwareFreq",
        label: "6.4 How often do you use digital tools or software for academic purposes?",
        options: [
          { value: "1", label: "Daily" },
          { value: "2", label: "Several times a week" },
          { value: "3", label: "Weekly" },
          { value: "4", label: "Occasionally" },
          { value: "5", label: "Rarely" },
          { value: "6", label: "Never" },
        ],
        required: true,
      },
      {
        type: "multi",
        key: "q6_5_aiTools",
        label: "6.5 Which AI tools have you used for academic or other purposes?",
        options: [
          { value: "1", label: "ChatGPT" },
          { value: "2", label: "Google Gemini" },
          { value: "3", label: "Microsoft Copilot" },
          { value: "4", label: "Claude" },
          { value: "5", label: "Perplexity AI" },
          { value: "6", label: "GitHub Copilot" },
          { value: "7", label: "Grammarly AI" },
          { value: "8", label: "I have not used any AI tool" },
          { value: "9", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "multi",
        key: "q6_6_aiPurpose",
        label: "6.6 For what purposes do you use AI tools?",
        options: [
          { value: "1", label: "Understanding academic concepts" },
          { value: "2", label: "Completing assignments or projects" },
          { value: "3", label: "Research and information gathering" },
          { value: "4", label: "Writing, editing, or proofreading" },
          { value: "5", label: "Coding or data analysis" },
          { value: "6", label: "Generating ideas or content" },
          { value: "7", label: "I do not use AI tools" },
          { value: "8", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q6_7_earnOnline",
        label: "6.7 Do you use digital platforms or AI tools to earn income?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
        required: true,
        help: "If you answer 'No', you will skip to Section 7.",
      },
      {
        type: "multi",
        key: "q6_8_earnMethods",
        label: "6.8 Which methods do you use to earn income online?",
        options: [
          { value: "1", label: "Freelancing" },
          { value: "2", label: "Online teaching or tutoring" },
          { value: "3", label: "Content creation" },
          { value: "4", label: "AI-related services" },
          { value: "5", label: "Online selling / e-commerce" },
          { value: "6", label: "Social media monetization" },
          { value: "7", label: "Other", hasOther: true },
        ],
        required: true,
        // Conditional visibility handled in component
      },
      {
        type: "single",
        key: "q6_9_onlineIncome",
        label: "6.9 What is your approximate monthly income from online sources?",
        options: [
          { value: "1", label: "Less than PKR 50,000" },
          { value: "2", label: "PKR 50,000 – 100,000" },
          { value: "3", label: "PKR 100,001 – 200,000" },
          { value: "4", label: "Above PKR 200,000" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 7 ============
  {
    id: 7,
    title: "Section 7: Financial Support & Scholarships",
    shortTitle: "Financial Support",
    description: "How your education is financed and any scholarships you receive.",
    questions: [
      {
        type: "single",
        key: "q7_1_financer",
        label: "7.1 Who primarily finances your education?",
        options: [
          { value: "1", label: "Parents / Guardians" },
          { value: "2", label: "Self-earned income (Job / Business / Freelancing)" },
          { value: "3", label: "Scholarship / Stipend" },
          { value: "4", label: "Education loan" },
          { value: "5", label: "Siblings / Relative" },
          { value: "6", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_2_tuitionFee",
        label: "7.2 What is your approximate tuition fee per semester?",
        options: [
          { value: "1", label: "Below 50k" },
          { value: "2", label: "50k to 1 lakh" },
          { value: "3", label: "1 lakh to 2 lakh" },
          { value: "4", label: "Above 2 lakhs" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_3_hasScholarship",
        label: "7.3 Are you currently receiving any scholarship, stipend or financial aid?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
        required: true,
        help: "If you answer 'No', you will skip to Q7.7.",
      },
      {
        type: "single",
        key: "q7_4_scholarshipType",
        label: "7.4 What type of scholarship or aid do you receive?",
        options: [
          { value: "1", label: "Merit-based scholarship" },
          { value: "2", label: "Need-based scholarship" },
          { value: "3", label: "Government / HEC scholarship" },
          { value: "4", label: "University-funded scholarship" },
          { value: "5", label: "Private / Corporate / NGO scholarship" },
          { value: "6", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_5_scholarshipPct",
        label: "7.5 Approximately what percentage of your educational expenses is covered by the scholarship / aid?",
        options: [
          { value: "1", label: "Less than 25%" },
          { value: "2", label: "25% – 50%" },
          { value: "3", label: "51% – 75%" },
          { value: "4", label: "More than 75%" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_6_scholarshipImpact",
        label: "7.6 Has your scholarship had a positive impact on your academic studies?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_7_scholarshipInfo",
        label: "7.7 The university provided clear and timely information about available scholarships.",
        options: [
          { value: "1", label: "Strongly disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neither agree nor disagree" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly agree" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_8_financialDifficultyAffected",
        label: "7.8 During the current academic year, have financial difficulties affected your attendance, performance or ability to continue studying?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q7_9_expenseDifficulty",
        label: "7.9 How difficult is it for you / your family to meet your education-related expenses (books, transport, hostel, etc.)?",
        options: [
          { value: "1", label: "Not difficult" },
          { value: "2", label: "Slightly difficult" },
          { value: "3", label: "Moderately difficult" },
          { value: "4", label: "Very difficult" },
          { value: "5", label: "Extremely difficult" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 8 ============
  {
    id: 8,
    title: "Section 8: Health & Well-being",
    shortTitle: "Health & Well-being",
    description: "Your physical and emotional health, and access to support services.",
    questions: [
      {
        type: "single",
        key: "q8_1_physicalHealth",
        label: "8.1 How would you rate your physical health?",
        options: [
          { value: "1", label: "Excellent" },
          { value: "2", label: "Very good" },
          { value: "3", label: "Good" },
          { value: "4", label: "Fair" },
          { value: "5", label: "Poor" },
          { value: "6", label: "Very poor" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_2_stressFreq",
        label: "8.2 During the past four weeks, how often did stress / worry affect your daily routine?",
        options: [
          { value: "1", label: "Never" },
          { value: "2", label: "Rarely" },
          { value: "3", label: "Sometimes" },
          { value: "4", label: "Often" },
          { value: "5", label: "Almost every day" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_3_sleepQuality",
        label: "8.3 Over the past four weeks, how satisfied have you been with the quality of your sleep?",
        options: [
          { value: "1", label: "Very satisfied" },
          { value: "2", label: "Satisfied" },
          { value: "3", label: "Neutral / Moderate" },
          { value: "4", label: "Dissatisfied" },
          { value: "5", label: "Very dissatisfied" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_4_healthAffectsStudy",
        label: "8.4 During your previous university semester, how often did your physical / emotional health make it difficult to attend classes / complete academic work?",
        options: [
          { value: "1", label: "Never" },
          { value: "2", label: "Rarely" },
          { value: "3", label: "Sometimes" },
          { value: "4", label: "Often" },
          { value: "5", label: "Almost every day" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_5_knowSupportSource",
        label: "8.5 If you needed support for stress or emotional well-being, would you know where to seek help at your university?",
        options: [
          { value: "1", label: "Yes, clearly" },
          { value: "2", label: "Somewhat / Know a service exists" },
          { value: "3", label: "Not sure" },
          { value: "4", label: "No, not aware" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_6_healthAccess",
        label: "8.6 How easy is it to access health / first aid services at your university?",
        options: [
          { value: "1", label: "Very easy" },
          { value: "2", label: "Fairly easy" },
          { value: "3", label: "Neutral / Moderate" },
          { value: "4", label: "Somewhat difficult" },
          { value: "5", label: "Very difficult" },
          { value: "6", label: "Not aware" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_7_firstAidTraining",
        label: "8.7 Have you ever received any formal training in First Aid?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "3", label: "Not sure" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q8_8_firstAidCompulsory",
        label: "8.8 Do you think first aid training should be compulsory in schools, colleges / universities?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "3", label: "Not sure" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 9 ============
  {
    id: 9,
    title: "Section 9: Employability & Internship",
    shortTitle: "Employability",
    description: "Your internship experience and readiness for the job market.",
    questions: [
      {
        type: "single",
        key: "q9_1_internshipStatus",
        label: "9.1 What is your current internship status?",
        options: [
          { value: "1", label: "Completed at least one internship" },
          { value: "2", label: "Currently doing an internship" },
          { value: "3", label: "Looking for an internship" },
          { value: "4", label: "Have not done / looked for one" },
        ],
        required: true,
        help: "If you have not done or started an internship, you will skip to Q9.4.",
      },
      {
        type: "single",
        key: "q9_2_internshipCount",
        label: "9.2 How many internships have you completed, including the current one?",
        options: [
          { value: "1", label: "One" },
          { value: "2", label: "Two" },
          { value: "3", label: "Three or more" },
          { value: "4", label: "None" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q9_3_internshipRelevance",
        label: "9.3 How relevant was your most recent internship to your field of study?",
        options: [
          { value: "1", label: "Highly relevant" },
          { value: "2", label: "Somewhat relevant" },
          { value: "3", label: "Slightly relevant" },
          { value: "4", label: "Not relevant" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q9_4_uniSupportRating",
        label: "9.4 How would you rate your university's support for internship / career placement?",
        options: [
          { value: "1", label: "Very poor" },
          { value: "2", label: "Poor" },
          { value: "3", label: "Average" },
          { value: "4", label: "Good" },
          { value: "5", label: "Very good" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q9_5_careerEventsParticipated",
        label: "9.5 Have you participated in any career fair, career counselling session, skill workshop or industry talk organized by your university?",
        options: [
          { value: "1", label: "Yes, once" },
          { value: "2", label: "Yes, more than once" },
          { value: "3", label: "No" },
          { value: "4", label: "Not aware of such activities" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q9_6_familyBusiness",
        label: "9.6 Are you involved in any family business?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q9_7_employabilityConfidence",
        label: "9.7 How confident do you feel about your employability after graduation?",
        options: [
          { value: "1", label: "Very confident" },
          { value: "2", label: "Confident" },
          { value: "3", label: "Neither confident nor unconfident" },
          { value: "4", label: "Unconfident" },
          { value: "5", label: "Very unconfident" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q9_8_lackingSkills",
        label: "9.8 Which skills or experiences are most lacking in your preparation for the job market?",
        options: [
          { value: "1", label: "Technical / field-specific skills" },
          { value: "2", label: "Communication skills" },
          { value: "3", label: "Problem-solving skills" },
          { value: "4", label: "Digital / computer skills" },
          { value: "5", label: "Industry exposure" },
          { value: "6", label: "Networking" },
          { value: "7", label: "CV / interview skills" },
          { value: "8", label: "Teamwork / leadership" },
          { value: "9", label: "None" },
        ],
        required: true,
      },
    ],
  },

  // ============ SECTION 10 ============
  {
    id: 10,
    title: "Section 10: Career Aspirations",
    shortTitle: "Career Aspirations",
    description: "Your plans and concerns about life after graduation.",
    questions: [
      {
        type: "single",
        key: "q10_1_decidedAfterGrad",
        label: "10.1 Have you decided what you want to do immediately after graduation?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "3", label: "Not sure" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q10_2_primaryPlan",
        label: "10.2 Which option best describes your primary plan after graduation?",
        options: [
          { value: "1", label: "Seek employment" },
          { value: "2", label: "Continue higher studies", note: "If selected, Q10.3 will be auto-set to 'Not applicable'." },
          { value: "3", label: "Start a business / entrepreneurship" },
          { value: "4", label: "Join / expand family business" },
          { value: "5", label: "Prepare for civil services / competitive exams" },
          { value: "6", label: "Move abroad for work" },
          { value: "7", label: "Move abroad for education", note: "If selected, Q10.3 will be auto-set to 'Not applicable'." },
          { value: "8", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q10_3_preferredSector",
        label: "10.3 Which sector would you most prefer to work in?",
        options: [
          { value: "1", label: "Federal / provincial government" },
          { value: "2", label: "Public sector organization" },
          { value: "3", label: "Private sector" },
          { value: "4", label: "NGO / development sector" },
          { value: "5", label: "International organization" },
          { value: "6", label: "Self-employment / startup" },
          { value: "7", label: "Academia / research" },
          { value: "8", label: "Not decided" },
          { value: "9", label: "Not applicable (planning further education / not entering the workforce immediately)" },
          { value: "10", label: "Other", hasOther: true },
        ],
        required: true,
        help: "If you chose 'Continue higher studies' or 'Move abroad for education' in Q10.2, this will be auto-set to option 9.",
      },
      {
        type: "single",
        key: "q10_4_careerInfluence",
        label: "10.4 Which factor has the greatest influence on your career choice?",
        options: [
          { value: "1", label: "Personal interest / passion" },
          { value: "2", label: "Job opportunities / market demand" },
          { value: "3", label: "Expected salary / financial stability" },
          { value: "4", label: "Family expectations" },
          { value: "5", label: "Job security" },
          { value: "6", label: "Social status / prestige" },
          { value: "7", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q10_5_educationPrepCareer",
        label: "10.5 My current education is adequately preparing me for my preferred career path.",
        options: [
          { value: "1", label: "Strongly agree" },
          { value: "2", label: "Agree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Disagree" },
          { value: "5", label: "Strongly disagree" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q10_6_biggestConcern",
        label: "10.6 What is your biggest concern about your future career?",
        options: [
          { value: "1", label: "Unemployment / job insecurity" },
          { value: "2", label: "Low salary / financial instability" },
          { value: "3", label: "Difficulty pursuing higher studies" },
          { value: "4", label: "Family responsibilities / pressure" },
          { value: "5", label: "Intense competition" },
          { value: "6", label: "Uncertainty about career direction" },
          { value: "7", label: "Choosing the wrong career" },
          { value: "8", label: "Other", hasOther: true },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q10_7_willingRelocate",
        label: "10.7 Would you be willing to relocate to another city or country for a better career opportunity?",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "3", label: "Maybe / depends on circumstances" },
        ],
        required: true,
      },
      {
        type: "single",
        key: "q10_8_careerSupport",
        label: "10.8 What type of career support would help you most at present?",
        options: [
          { value: "1", label: "Career counselling / mentoring" },
          { value: "2", label: "Internship / placement opportunities" },
          { value: "3", label: "Technical skill training" },
          { value: "4", label: "Communication / soft-skill training" },
          { value: "5", label: "CV and interview preparation" },
          { value: "6", label: "Entrepreneurship / startup support" },
          { value: "7", label: "Networking with employers / alumni" },
          { value: "8", label: "Other", hasOther: true },
        ],
        required: true,
      },
    ],
  },
];

// Skip-logic rules: which questions are visible based on answers
export function isQuestionVisible(questionKey: string, answers: Record<string, any>): boolean {
  switch (questionKey) {
    case "q6_8_earnMethods":
    case "q6_9_onlineIncome":
      // Only visible if Q6.7 == "1" (Yes)
      return answers.q6_7_earnOnline === "1";
    case "q7_4_scholarshipType":
    case "q7_5_scholarshipPct":
    case "q7_6_scholarshipImpact":
      // Only visible if Q7.3 == "1" (Yes)
      return answers.q7_3_hasScholarship === "1";
    case "q9_2_internshipCount":
    case "q9_3_internshipRelevance":
      // Only visible if Q9.1 != "4" (i.e. has done or is doing internship)
      return answers.q9_1_internshipStatus && answers.q9_1_internshipStatus !== "4";
    default:
      return true;
  }
}

// Q10.3 auto-fill rule: if Q10.2 is "2" or "7", Q10.3 should be "9"
export function getAutoFilledValue(key: string, answers: Record<string, any>): string | undefined {
  if (key === "q10_3_preferredSector") {
    const plan = answers.q10_2_primaryPlan;
    if (plan === "2" || plan === "7") {
      return "9"; // Not applicable
    }
  }
  return undefined;
}
