import React, { useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      alert("Please upload a resume and job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post("/api/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error("Frontend error:", err.message);
      setFeedback("⚠️ We couldn’t analyze your resume. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>🧠 Smart Career Coach</h1>
      <div className="form-group">
        <label>Upload Resume (PDF):</label>
        <input type="file" accept=".pdf" onChange={handleResumeChange} />
      </div>

      <div className="form-group">
        <label>Paste Job Description:</label>
        <textarea
          rows="6"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <button className="analyze-btn" onClick={handleAnalyze}>
        Analyze Resume
      </button>

      <div className="feedback">
        <h3>AI Feedback:</h3>
        <pre>{feedback}</pre>
      </div>
    </div>
  );
}

export default Dashboard;
