const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const extractData = require("../utils/extractor");

exports.parseResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const extracted = extractData(data.text);
    const saved = await Resume.create(extracted);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Parsing failed" });
  }
};

exports.getAllResumes = async (req, res) => {
  const resumes = await Resume.find().sort({ uploadedAt: -1 });
  res.json({ success: true, data: resumes });
};

exports.searchResumesByName = async (req, res) => {
  const resumes = await Resume.find({
    name: { $regex: req.query.name, $options: "i" }
  });
  res.json({ success: true, data: resumes });
};

exports.filterBySkills = async (req, res) => {
  const skill = req.query.skill;
  if (!skill) {
    return res.status(400).json({ success: false, message: "Skill is required" });
  }

  const resumes = await Resume.find({
    skills: { $regex: skill, $options: "i" }
  });

  res.json({ success: true, data: resumes });
};
