export const diffusionConfig = {
  /**
   * provider: "pollinations" (default) keeps using the public diffusion proxy.
   * provider: "custom-backend" lets you plug in your own secured endpoint.
   */
  provider: "pollinations",
  pollinationsBaseUrl: "https://image.pollinations.ai/prompt/",

  /**
   * Only used when provider === "custom-backend".
   * Example: "https://your-domain.com/api/generate-image"
   */
  backendEndpoint: null,
  backendApiKey: null,

  /**
   * Optional metadata for custom backends.
   */
  modelId: "stabilityai/stable-diffusion-3-medium",
  guidanceScale: 7,
  steps: 30,
  aspectRatio: "4:3",

  /**
   * Prompt shaping helpers. These get appended to every kid prompt.
   */
  promptPrefix: "High-detail concept art of the future of Saudi Arabia",
  promptSuffix: "vibrant colors, joyful atmosphere, for children, inspirational",
  digitalStyleHints: [
    "digital painting",
    "storybook illustration",
    "soft lighting",
    "brushstroke texture",
    "futuristic Saudi landmarks",
  ],
};

