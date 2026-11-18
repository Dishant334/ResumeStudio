import Resume from "../models/Resume.js";
import { getImageKit } from "../configs/imageKit.js";
import fs from "fs";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const title = (req.body.title || "").trim() || "Untitled Resume";

    const newResume = await Resume.create({ userId, title });

    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deleted = await Resume.findOneAndDelete({
      userId,
      _id: resumeId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { __v, createdAt, updatedAt, ...cleanResume } =
      resume.toObject();

    return res.status(200).json({ resume: cleanResume });
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      public: true,
      _id: resumeId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { userId, __v, ...publicResume } = resume.toObject();
    return res.status(200).json({ resume: publicResume });
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const EDITABLE = [
  "title", "public", "template", "accent_color", "professional_summary",
  "skills", "personal_info", "experience", "project", "education",
  "certifications", "achievements",
];

export const updateResume = async (req, res) => {
  const image = req.file;
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;

    let parsed = {};
    if (resumeData) {
      parsed = typeof resumeData === "string" ? JSON.parse(resumeData) : structuredClone(resumeData);
    }

    // whitelist: never let the client overwrite _id / userId
    const update = {};
    for (const key of EDITABLE) if (parsed[key] !== undefined) update[key] = parsed[key];

    if (image) {
      const imagekit = getImageKit();
      if (!imagekit) {
        return res.status(503).json({ message: "Image upload is not configured (IMAGEKIT_PRIVATE_KEY missing)" });
      }
      const response = await imagekit.files.upload({
        file: fs.createReadStream(image.path),
        fileName: "resume.jpg",
        folder: "user-resumes",
        transformation: {
          pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : ""),
        },
      });
      // dot-path so other personal_info fields are kept intact
      const info = update.personal_info || {};
      delete update.personal_info;
      for (const [k, v] of Object.entries(info)) update[`personal_info.${k}`] = v;
      update["personal_info.image"] = response.url;
    } else if (update.personal_info) {
      // keep the stored image when the client doesn't send a new one
      const info = update.personal_info;
      delete update.personal_info;
      for (const [k, v] of Object.entries(info)) update[`personal_info.${k}`] = v;
    }

    const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, { $set: update }, { new: true });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (err) {
    console.error("updateResume:", err.message);
    return res.status(500).json({ message: "Could not save resume: " + err.message });
  } finally {
    if (image) fs.unlink(image.path, () => {});
  }
};
