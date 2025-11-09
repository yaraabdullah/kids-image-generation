export const diffusionConfig = {
  /**
   * provider: "pollinations" (default) keeps using the public diffusion proxy.
   * provider: "custom-backend" lets you plug in your own secured endpoint.
   */
  provider: "custom-backend",
  pollinationsBaseUrl: "https://image.pollinations.ai/prompt/",

  /**
   * Only used when provider === "custom-backend".
   * Example: "https://your-domain.com/api/generate-image"
   */
  backendEndpoint: "http://localhost:4000/generate",
  backendApiKey: null,

  /**
   * Optional metadata for custom backends.
   */
  modelId: "gpt-image-1",
  guidanceScale: 7,
  steps: 30,
  aspectRatio: "1024x1024",

  /**
   * Prompt shaping helpers. These get appended to every kid prompt.
   */
  promptPrefix:
    "Highly detailed digital illustration of the Riyadh skyline featuring the Kingdom Centre Tower (Al Mamlaka) and Al Faisaliah Tower, Saudi Arabia future city, friendly for children",
  promptSuffix: "vibrant colors, joyful atmosphere, Saudi flag fluttering, inspirational art",
  digitalStyleHints: [
    "digital painting",
    "storybook illustration",
    "soft lighting",
    "brushstroke texture",
    "futuristic Saudi landmarks",
  ],
};

