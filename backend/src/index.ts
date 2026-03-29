import express from "express";
import cors from "cors";
import ttsRoutes from "./routes/tts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", ttsRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});