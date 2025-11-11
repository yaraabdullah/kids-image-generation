import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const { prompt, size = "1024x1024" } = req.body || {};
    const quality = "standard";

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt string" });
    }

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size,
      quality,
    });

    const imageBase64 = response?.data?.[0]?.b64_json ?? null;
    const imageUrl = response?.data?.[0]?.url ?? null;

    if (!imageBase64 && !imageUrl) {
      return res.status(502).json({ error: "OpenAI response missing image data" });
    }

    const finalUrl = imageUrl || `data:image/png;base64,${imageBase64}`;

    return res.status(200).json({ imageUrl: finalUrl });
  } catch (error) {
    console.error("Image generation failed:", error);
    const message =
      error?.error?.message ||
      error?.message ||
      "Unknown error generating image with OpenAI Images API";
    return res.status(500).json({ error: message });
  }
}

