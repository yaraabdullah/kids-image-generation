import { diffusionConfig } from "./config.js";

const views = {
  landing: document.getElementById("landing"),
  canvas: document.getElementById("canvasView"),
  book: document.getElementById("bookView"),
};

const buttons = {
  openBook: document.getElementById("openBookBtn"),
  openCanvas: document.getElementById("openCanvasBtn"),
  backFromCanvas: document.getElementById("backToLandingFromCanvas"),
  backFromBook: document.getElementById("backToLandingFromBook"),
  toCanvasFromBook: document.getElementById("jumpToCanvasFromBook"),
  addToBook: document.getElementById("addToBookBtn"),
  regenerate: document.getElementById("regenerateBtn"),
  prevPage: document.getElementById("prevPageBtn"),
  nextPage: document.getElementById("nextPageBtn"),
};

const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const statusMessage = document.getElementById("generationStatus");
const resultSection = document.getElementById("generatedResult");
const generatedImageEl = document.getElementById("generatedImage");

const nameDialog = document.getElementById("nameDialog");
const nameForm = document.getElementById("nameForm");
const kidNameInput = document.getElementById("kidNameInput");

const pageImage = document.getElementById("pageImage");
const pageKidName = document.getElementById("pageKidName");
const pageDate = document.getElementById("pageDate");
const pagePrompt = document.getElementById("pagePrompt");
const currentPageIndexEl = document.getElementById("currentPageIndex");
const totalPagesEl = document.getElementById("totalPages");

const STORAGE_KEY = "saudi-talent-book";

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `page-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const starterPages = [
  {
    id: makeId(),
    kidName: "Aisha",
    prompt:
      "The Kingdom Tower glowing with holographic palm trees that welcome families in Arabic and English, while floating lantern drones guide kids to rooftop playgrounds.",
    imageUrl:
      "https://image.pollinations.ai/prompt/The%20Kingdom%20Tower%20covered%20in%20hanging%20gardens%20and%20AI%20holograms,%20children%E2%80%99s%20play%20drones,%20sunset,%20vibrant%20colors?seed=1001",
    generatedAt: "2025-05-16",
  },
  {
    id: makeId(),
    kidName: "Salem",
    prompt:
      "Diriyah transformed into a smart heritage village where AI storytellers paint the mud walls with history and the date trees light up the paths for families.",
    imageUrl:
      "https://image.pollinations.ai/prompt/Diriyah%20heritage%20village%20with%20futuristic%20AI%20lights%20and%20storytelling%20holograms%20for%20kids,%20warm%20glow?seed=1002",
    generatedAt: "2025-05-18",
  },
  {
    id: makeId(),
    kidName: "Razan",
    prompt:
      "A flying tram connects Al Faisaliah Tower to a floating cloud park where AI caretakers grow flowers in the sky and inspire young inventors.",
    imageUrl:
      "https://image.pollinations.ai/prompt/Al%20Faisaliah%20Tower%20with%20floating%20gardens%20and%20AI%20flying%20tram,%20kids%20exploring,%20bright%20sky?seed=1003",
    generatedAt: "2025-05-20",
  },
];

let bookPages = loadPages();
let currentPageIndex = 0;
let latestGeneration = null;

initialize();

function initialize() {
  attachEventListeners();
  syncTotalPages();
  updatePageDisplay();
  hideStatus();
}

function attachEventListeners() {
  buttons.openBook?.addEventListener("click", () => showView("book"));
  buttons.openCanvas?.addEventListener("click", () => showView("canvas"));
  buttons.backFromCanvas?.addEventListener("click", () => showView("landing"));
  buttons.backFromBook?.addEventListener("click", () => showView("landing"));
  buttons.toCanvasFromBook?.addEventListener("click", () => showView("canvas"));

  promptForm?.addEventListener("submit", handleGenerate);

  buttons.addToBook?.addEventListener("click", () => {
    if (!latestGeneration) return;
    kidNameInput.value = "";
    nameDialog.showModal();
    setTimeout(() => kidNameInput.focus(), 80);
  });

  nameForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formAction = event.submitter?.value;
    if (formAction === "cancel") {
      nameDialog.close();
      return;
    }

    const kidName = kidNameInput.value.trim();
    if (!kidName) return;
    addLatestGenerationToBook(kidName);
    nameDialog.close();
  });

  buttons.regenerate?.addEventListener("click", resetGeneration);

  buttons.prevPage?.addEventListener("click", () => {
    if (currentPageIndex > 0) {
      currentPageIndex -= 1;
      updatePageDisplay();
    }
  });

  buttons.nextPage?.addEventListener("click", () => {
    if (currentPageIndex < bookPages.length - 1) {
      currentPageIndex += 1;
      updatePageDisplay();
    }
  });
}

function showView(view) {
  views.landing?.classList.toggle("hidden", view !== "landing");
  views.canvas?.classList.toggle("hidden", view !== "canvas");
  views.book?.classList.toggle("hidden", view !== "book");

  if (view === "canvas") {
    promptInput.focus();
    scrollTo({ top: 0, behavior: "smooth" });
  }

  if (view === "book") {
    scrollTo({ top: 0, behavior: "smooth" });
  }
}

function loadPages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [...starterPages];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...starterPages];
    }
    return parsed;
  } catch (error) {
    console.error("Failed to load pages, restoring defaults", error);
    return [...starterPages];
  }
}

function savePages() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookPages));
  } catch (error) {
    console.error("Unable to save pages", error);
  }
}

async function handleGenerate(event) {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showStatus("Please describe your futuristic idea before we can paint it.", true);
    return;
  }

  const styledPrompt = composePrompt(prompt);

  toggleFormDisabled(true);
  showStatus("Painting your story in the sky... ✨", false);
  resultSection.classList.add("hidden");

  try {
    const imageUrl = await generateImage(styledPrompt);
    latestGeneration = {
      prompt,
      styledPrompt,
      imageUrl,
    };
    generatedImageEl.src = imageUrl;
    generatedImageEl.alt = styledPrompt;
    resultSection.classList.remove("hidden");
    showStatus("Here is your future vision! Add it to the book when you're ready.", false, true);
  } catch (error) {
    console.error(error);
    showStatus(
      "We couldn't reach our art studio. Please try again in a few moments.",
      true
    );
  } finally {
    toggleFormDisabled(false);
  }
}

async function generateImage(prompt) {
  if (shouldUseCustomBackend()) {
    return generateViaBackend(prompt);
  }
  return generateViaPollinations(prompt);
}

function addLatestGenerationToBook(kidName) {
  if (!latestGeneration) return;

  const entry = {
    id: makeId(),
    kidName,
    prompt: latestGeneration.prompt,
    imageUrl: latestGeneration.imageUrl,
    generatedAt: new Date().toISOString().slice(0, 10),
  };

  bookPages = [...bookPages, entry];
  currentPageIndex = bookPages.length - 1;
  syncTotalPages();
  updatePageDisplay();
  savePages();

  showView("book");
  highlightNewPage();
}

function updatePageDisplay() {
  if (!bookPages.length) {
    pageImage.src = "";
    pageKidName.textContent = "—";
    pageDate.textContent = "—";
    pagePrompt.textContent = "No pages yet. Create your first masterpiece!";
    currentPageIndexEl.textContent = "0";
    totalPagesEl.textContent = "0";
    buttons.prevPage.disabled = true;
    buttons.nextPage.disabled = true;
    return;
  }

  const currentPage = bookPages[currentPageIndex];
  pageImage.src = currentPage.imageUrl;
  pageImage.alt = currentPage.prompt;
  pageKidName.textContent = currentPage.kidName;
  pageDate.textContent = formatDate(currentPage.generatedAt);
  pagePrompt.textContent = currentPage.prompt;
  currentPageIndexEl.textContent = currentPageIndex + 1;
  totalPagesEl.textContent = bookPages.length;

  buttons.prevPage.disabled = currentPageIndex === 0;
  buttons.nextPage.disabled = currentPageIndex === bookPages.length - 1;
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function syncTotalPages() {
  totalPagesEl.textContent = bookPages.length;
}

function showStatus(message, isError = false, stayVisible = false) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden", "error");
  if (isError) {
    statusMessage.classList.add("error");
  }
  if (!stayVisible) {
    setTimeout(() => hideStatus(), 4000);
  }
}

function hideStatus() {
  statusMessage.classList.add("hidden");
}

function toggleFormDisabled(state) {
  Array.from(promptForm.elements).forEach((element) => {
    element.disabled = state;
  });
}

function resetGeneration() {
  promptInput.focus();
  latestGeneration = null;
  resultSection.classList.add("hidden");
  hideStatus();
}

function highlightNewPage() {
  const pageDisplay = document.querySelector(".page-display");
  if (!pageDisplay) return;
  pageDisplay.classList.add("recently-added");
  setTimeout(() => {
    pageDisplay.classList.remove("recently-added");
  }, 2800);
}

document.addEventListener("keydown", (event) => {
  if (nameDialog.open && event.key === "Escape") {
    nameDialog.close();
  }
});

function composePrompt(basePrompt) {
  const trimmed = basePrompt.trim();
  const prefix = diffusionConfig.promptPrefix?.trim();
  const suffix = diffusionConfig.promptSuffix?.trim();
  const styleHints = Array.isArray(diffusionConfig.digitalStyleHints)
    ? diffusionConfig.digitalStyleHints.filter(Boolean).map((hint) => hint.trim())
    : [];

  const parts = [];
  if (prefix) parts.push(prefix);
  parts.push(trimmed);
  if (styleHints.length) parts.push(styleHints.join(", "));
  if (suffix) parts.push(suffix);

  return parts.join(", ");
}

function shouldUseCustomBackend() {
  return Boolean(
    diffusionConfig.provider === "custom-backend" && diffusionConfig.backendEndpoint
  );
}

async function generateViaBackend(prompt) {
  const endpoint = diffusionConfig.backendEndpoint;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (diffusionConfig.backendApiKey) {
    headers.Authorization = `Bearer ${diffusionConfig.backendApiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt,
      model: diffusionConfig.modelId,
      guidance_scale: diffusionConfig.guidanceScale ?? 7,
      steps: diffusionConfig.steps ?? 30,
      aspect_ratio: diffusionConfig.aspectRatio ?? "4:3",
    }),
  });

  if (!response.ok) {
    throw new Error(`Diffusion backend failed: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.imageUrl) {
    return payload.imageUrl;
  }

  if (payload.imageBase64) {
    return dataUrlFromBase64(payload.imageBase64);
  }

  throw new Error("Unexpected diffusion backend response");
}

async function generateViaPollinations(prompt) {
  const baseUrl =
    diffusionConfig.pollinationsBaseUrl || "https://image.pollinations.ai/prompt/";
  const seed = Date.now();
  const url = `${baseUrl}${encodeURIComponent(prompt)}?seed=${seed}`;

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = url;
  });

  return `${url}&cacheBust=${seed}`;
}

function dataUrlFromBase64(base64String) {
  return `data:image/png;base64,${base64String}`;
}

