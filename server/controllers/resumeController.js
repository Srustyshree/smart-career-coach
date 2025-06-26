exports.analyzeResume = async (req, res) => {
  console.log("✅ Backend hit! Received resume analysis request.");
  console.log("📄 Resume file:", req.file);
  console.log("📝 Job description:", req.body.jobDescription);

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume file missing" });
    }
    if (!req.body.jobDescription) {
      return res.status(400).json({ error: "Job description missing" });
    }

    const buffer = req.file.buffer;
    const parsed = await pdfParse(buffer);
    const resumeText = parsed.text;

    const prompt = `You're a career coach. Here's a resume and a job description. Give actionable feedback to improve resume match.\n\nResume:\n${resumeText}\n\nJob Description:\n${req.body.jobDescription}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ feedback: response.choices[0].message.content });
  } catch (err) {
    console.error("❌ Backend error:", err.message);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
