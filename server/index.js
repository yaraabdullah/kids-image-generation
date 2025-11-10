import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn("Warning: OPENAI_API_KEY is not set. Image generation requests will fail.");
}

const client = new OpenAI({
  apiKey: openaiApiKey,
});

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, size = "1024x1024" } = req.body || {};
    const quality = "low";

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt string" });
    }

    if (!openaiApiKey) {
      return res.status(500).json({ error: "Server misconfiguration: missing OPENAI_API_KEY" });
    }

    const response = await client.images.generate({
      model: "gpt-image-3",
      prompt,
      size,
      quality,
      response_format: "b64_json",
    });

    const imageBase64 = response?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return res.status(502).json({ error: "OpenAI response missing image data" });
    }

    res.json({ imageBase64 });
  } catch (error) {
    console.error("Image generation failed:", error);
    const message =
      error?.error?.message ||
      error?.message ||
      "Unknown error generating image with OpenAI Images API";
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Kids image generation backend ready on http://localhost:${port}`);
});


