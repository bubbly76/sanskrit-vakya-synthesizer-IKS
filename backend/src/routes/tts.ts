import { Router } from "express";

const router = Router();

// 🔥 Simple route (no API)
router.post("/tts/synthesize", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  res.json({
    success: true,
    text,
  });
});

export default router;