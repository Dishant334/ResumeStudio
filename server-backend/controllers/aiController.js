import Resume from "../models/Resume.js";
import { aiComplete } from "../configs/ai.js";

const fail = (res, error) =>
  res.status(error.status || 500).json({ message: error.message || "Something went wrong" });

const clean = (s) => s.replace(/^```(?:\w+)?\s*|\s*```$/g, "").trim();

// POST /api/ai/enhanced-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) return res.status(400).json({ message: "Missing required field" });

    const enhancedContent = clean(
      await aiComplete(`${userContent}\n\nReturn only the final text, no quotes, no preface.`)
    );
    if (!enhancedContent) return res.status(502).json({ message: "AI returned an empty response" });
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return fail(res, error);
  }
};

// POST /api/ai/enhanced-job-desc  (also used for project descriptions)
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) return res.status(400).json({ message: "Missing required field" });

    const prompt = `Rewrite this as 2-4 strong resume bullet points (each starting with "• ").
- Start with action verbs
- Include impact / measurable results where plausible, but do not invent facts
- ATS-friendly, concise
Return only the bullets.

${userContent}`;
    const enhancedContent = clean(await aiComplete(prompt));
    if (!enhancedContent) return res.status(502).json({ message: "AI returned an empty response" });
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return fail(res, error);
  }
};

const ALLOWED = [
  "professional_summary", "skills", "personal_info", "experience",
  "project", "education", "certifications", "achievements",
];

// POST /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    if (!resumeText) return res.status(400).json({ message: "Missing required field" });

    const prompt = `Extract structured JSON data from this resume.

STRICT RULES:
- Return ONLY valid JSON, no markdown fences, no explanation
- Dates as "YYYY-MM" when possible
- Follow this schema exactly:

{
  "professional_summary": "",
  "skills": [""],
  "personal_info": {"full_name":"","profession":"","email":"","phone":"","location":"","linkedin":"","github":"","website":""},
  "experience": [{"company":"","position":"","start_date":"","end_date":"","description":"","is_current":false}],
  "project": [{"name":"","type":"","tech":"","link":"","description":""}],
  "education": [{"institution":"","degree":"","field":"","graduation_date":"","gpa":""}],
  "certifications": [""],
  "achievements": [""]
}

Resume:
${resumeText}`;

    const text = clean(await aiComplete(prompt));
    let parsed;
    try {
      parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    } catch {
      return res.status(502).json({ message: "AI returned invalid JSON. Please try again." });
    }

    const data = {};
    for (const k of ALLOWED) if (parsed[k] !== undefined) data[k] = parsed[k];

    const newResume = await Resume.create({
      userId: req.userId,
      title: title || "Imported Resume",
      ...data,
    });
    return res.json({ resumeId: newResume._id });
  } catch (error) {
    return fail(res, error);
  }
};
