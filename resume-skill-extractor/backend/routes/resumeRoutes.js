const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  parseResume,
  getAllResumes,
  searchResumesByName,
  filterBySkills
} = require("../controllers/resumeController");

router.post("/upload", upload.single("file"), parseResume);
router.get("/all", getAllResumes);
router.get("/search", searchResumesByName);
router.get("/filter", filterBySkills);

module.exports = router;
