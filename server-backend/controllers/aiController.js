//controller for enhancing a resume's professional summary

import Resume from "../models/Resume.js";


//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary=async(req,res)=>{
    try{
       const {userContent}=req.body

       if(!userContent){
        return res.status(400).json({message:"Missing required field"})
       }
    
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.OPENAI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userContent }]
        }
      ]
    })
  }
);

const data = await response.json();

const enhancedContent =
  data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

     return res.status(200).json({enhancedContent})
    }catch(error){
     console.error("FULL ERROR:", JSON.stringify(error, null, 2));
  return res.status(400).json({ message: error.message });
    }
}
//controller for enhancing a resume's job description
//POST : /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const prompt = `
Enhance this job description in 1-2 strong resume lines.
- Use action verbs
- Include impact/results
- Make it ATS-friendly

${userContent}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.OPENAI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const enhancedContent =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.status(200).json({ enhancedContent });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

//controller for uploading a resume to the database
//POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const prompt = `
Extract structured JSON data from this resume.

STRICT RULES:
- Return ONLY valid JSON
- No explanation text
- Follow this schema exactly:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [],
  "project": [],
  "education": []
}

Resume:
${resumeText}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.OPENAI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🛡️ SAFE JSON PARSE
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON returned from AI");
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData
    });

    res.json({ resumeId: newResume._id });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};