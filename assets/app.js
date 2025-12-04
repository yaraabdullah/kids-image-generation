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
  downloadPdf: document.getElementById("downloadPdfBtn"),
};

const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const statusMessage = document.getElementById("generationStatus");
const resultSection = document.getElementById("generatedResult");
const generatedImageEl = document.getElementById("generatedImage");

const nameDialog = document.getElementById("nameDialog");
const nameForm = document.getElementById("nameForm");
const kidNameInput = document.getElementById("kidNameInput");
const storyInput = document.getElementById("storyInput");

const bookCoverDisplay = document.getElementById("bookCoverDisplay");
const bookPage = document.getElementById("bookPage");
const pageIndicator = document.getElementById("pageIndicator");
const pageDisplay = document.querySelector(".page-display");

const pageElements = {
  container: bookPage,
  image: document.getElementById("pageImage"),
  kidName: document.getElementById("pageKidName"),
  date: document.getElementById("pageDate"),
  prompt: document.getElementById("pagePrompt"),
};

const languageToggle = document.getElementById("toggleLanguageBtn");

const LANGUAGE_STORAGE_KEY = "saudi-talent-language";

const translations = {
  en: {
    "hero.tagline": "Saudi Kids x AI",
    "hero.headline": "Let's draw the future of Saudi Arabia with AI!",
    "hero.subtitle":
      "Describe how you imagine your favorite place in Saudi Arabia powered by artificial intelligence, and watch your ideas come alive as vibrant art.",
    "hero.ctaBook": "Explore the Visual Book",
    "hero.ctaCanvas": "Start Painting",
    "canvas.heading": "Imagine a place…",
    "canvas.description":
      "Tell us how a place in Saudi Arabia looks when AI helps it shine in the future. We will turn your story into a glowing illustration.",
    "canvas.label": "Describe your futuristic Saudi scene",
    "canvas.generate": "Generate Artwork",
    "canvas.placeholder":
      "Example: \"The Kingdom Tower covered in smart gardens that change colors with the sunset while drones guide visitors in Arabic and English.\"",
    "button.back": "Back",
    "result.addToBook": "Add to Saudi Talent Book",
    "result.tryAnother": "Try a new idea",
    "book.heading": "Saudi Talent Paint",
    "book.description":
      "Flip through the living book of children's visions. Each page celebrates a young Saudi dreamer.",
    "book.create": "Create a new page",
    "book.page.madeBy": "Made by",
    "book.page.on": "On",
    "book.page.storyLabel": "Story:",
    "book.pageIndicator": "Page {current} of {total}",
    "dialog.heading": "Add your masterpiece to the Saudi Talent Book",
    "dialog.nameLabel": "Who should we credit?",
    "dialog.storyLabel": "Tell us the story for this page",
    "dialog.namePlaceholder": "Write your name here",
    "dialog.storyPlaceholder": "Write the story, details, or feelings that go with this artwork",
    "dialog.cancel": "Cancel",
    "dialog.add": "Add to book",
    "footer.tagline": "Crafted for young Saudi dreamers • Empowering creativity with responsible AI",
    "status.generating": "Painting your story in the sky... ✨",
    "status.generatingShort": "Thinking...",
    "status.success": "Here is your future vision! Add it to the book when you're ready.",
    "status.error": "We couldn't reach our art studio. Please try again in a few moments.",
    "status.missingPrompt": "Please describe your futuristic idea before we can paint it.",
    "status.saveError": "We couldn't save your story to the book. Please try again.",
    "book.page.emptyMessage": "Add a new masterpiece to fill this page.",
    "book.downloadPdf": "📥 Download PDF Book",
    "status.generatingPdf": "Creating your PDF book... 📚",
    "status.pdfReady": "Your PDF is ready! Download starting...",
    "status.pdfError": "Could not create the PDF. Please try again.",
  },
  ar: {
    "hero.tagline": "أطفال السعودية × الذكاء الاصطناعي",
    "hero.headline": "هيا نرسم مستقبل السعودية بالذكاء الاصطناعي!",
    "hero.subtitle":
      "صف لنا كيف تتخيل مكانك المفضل في السعودية عندما يساعده الذكاء الاصطناعي، وسنحوّل فكرتك إلى لوحة نابضة بالحياة.",
    "hero.ctaBook": "استكشف الكتاب الفني",
    "hero.ctaCanvas": "ابدأ الرسم",
    "canvas.heading": "تخيل مكاناً...",
    "canvas.description":
      "أخبرنا كيف يبدو أي مكان في السعودية عندما يزدهر بالذكاء الاصطناعي. سنحوّل قصتك إلى لوحة متلألئة.",
    "canvas.label": "اكتب وصفاً لمشهدك السعودي المستقبلي",
    "canvas.generate": "أنشئ لوحة فنية",
    "canvas.placeholder":
      "مثال: \"برج المملكة مغطى بحدائق ذكية تغيّر ألوانها مع الغروب بينما ترشد الطائرات المسيّرة الزوار بالعربية والإنجليزية.\"",
    "button.back": "عودة",
    "result.addToBook": "أضف إلى كتاب المواهب",
    "result.tryAnother": "جرب فكرة جديدة",
    "book.heading": "كتاب المواهب السعودية",
    "book.description":
      "تصفح كتاباً حياً من رؤى الأطفال. كل صفحة تحتفل بحالم سعودي صغير.",
    "book.create": "أنشئ صفحة جديدة",
    "book.page.madeBy": "من إبداع",
    "book.page.on": "في",
    "book.page.storyLabel": "القصة:",
    "book.pageIndicator": "الصفحة {current} من {total}",
    "dialog.heading": "أضف تحفتك إلى كتاب المواهب السعودية",
    "dialog.nameLabel": "من صاحب هذا العمل؟",
    "dialog.storyLabel": "اكتب القصة التي تود إضافتها إلى هذه الصفحة",
    "dialog.namePlaceholder": "اكتب اسمك هنا",
    "dialog.storyPlaceholder": "احكِ القصة أو التفاصيل أو المشاعر المرتبطة بهذه اللوحة",
    "dialog.cancel": "إلغاء",
    "dialog.add": "إضافة إلى الكتاب",
    "footer.tagline": "صُنِع من أجل حالمين سعوديين صغار • نُطلق الإبداع بالذكاء الاصطناعي المسؤول",
    "status.generating": "نرسم قصتك في السماء... ✨",
    "status.generatingShort": "جارٍ الإبداع...",
    "status.success": "هذه رؤيتك المستقبلية! أضفها إلى الكتاب عندما تكون جاهزاً.",
    "status.error": "تعذر الوصول إلى ورشة الفن. حاول مرة أخرى بعد قليل.",
    "status.missingPrompt": "يرجى وصف فكرتك المستقبلية قبل أن نرسمها.",
    "status.saveError": "تعذر حفظ قصتك في الكتاب. حاول مرة أخرى.",
    "book.page.emptyMessage": "أضف تحفة جديدة لملء هذه الصفحة.",
    "book.downloadPdf": "📥 تحميل الكتاب PDF",
    "status.generatingPdf": "جارٍ إنشاء كتابك... 📚",
    "status.pdfReady": "الكتاب جاهز! جارٍ التحميل...",
    "status.pdfError": "تعذر إنشاء الكتاب. حاول مرة أخرى.",
  },
};

let currentLanguage = loadStoredLanguage();

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `page-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const fallbackPages = [
  {
    id: makeId(),
    kidName: "Aisha",
    prompt:
      "The Kingdom Tower glowing with holographic palm trees that welcome families in Arabic and English, while floating lantern drones guide kids to rooftop playgrounds.",
    story:
      "Aisha imagines the Kingdom Tower greeting every family with magical holographic palms and gentle drone guides that speak Arabic and English.",
    imageUrl:
      "https://image.pollinations.ai/prompt/The%20Kingdom%20Tower%20covered%20in%20hanging%20gardens%20and%20AI%20holograms,%20children%E2%80%99s%20play%20drones,%20sunset,%20vibrant%20colors?seed=1001",
    generatedAt: "2025-05-16",
  },
  {
    id: makeId(),
    kidName: "Salem",
    prompt:
      "Diriyah transformed into a smart heritage village where AI storytellers paint the mud walls with history and the date trees light up the paths for families.",
    story:
      "Salem’s story tells of Diriyah’s mud walls glowing with AI storytellers while date trees light safe paths for every visiting family.",
    imageUrl:
      "https://image.pollinations.ai/prompt/Diriyah%20heritage%20village%20with%20futuristic%20AI%20lights%20and%20storytelling%20holograms%20for%20kids,%20warm%20glow?seed=1002",
    generatedAt: "2025-05-18",
  },
  {
    id: makeId(),
    kidName: "Razan",
    prompt:
      "A flying tram connects Al Faisaliah Tower to a floating cloud park where AI caretakers grow flowers in the sky and inspire young inventors.",
    story:
      "Razan dreams of a flying tram to a cloud park, where AI caretakers grow sky-flowers that inspire every young inventor who visits.",
    imageUrl:
      "https://image.pollinations.ai/prompt/Al%20Faisaliah%20Tower%20with%20floating%20gardens%20and%20AI%20flying%20tram,%20kids%20exploring,%20bright%20sky?seed=1003",
    generatedAt: "2025-05-20",
  },
];

let bookPages = [];
let currentPageIndex = 0;
let latestGeneration = null;

initialize();

async function initialize() {
  setupLanguage();
  attachEventListeners();
  
  // Verify buttons exist
  if (!buttons.prevPage || !buttons.nextPage) {
    console.error("Navigation buttons not found in DOM");
  }
  
  await fetchBookPages();
  updateBookDisplay();
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
    storyInput.value = latestGeneration.prompt ?? "";
    nameDialog.showModal();
    setTimeout(() => kidNameInput.focus(), 80);
  });

  nameForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formAction = event.submitter?.value;
    if (formAction === "cancel") {
      nameDialog.close();
      return;
    }

    const kidName = kidNameInput.value.trim();
    const story = storyInput.value.trim();
    if (!kidName || !story) return;
    nameDialog.close();
    try {
      await addLatestGenerationToBook(kidName, story);
    } catch (error) {
      console.error("Failed to add story to book", error);
    }
  });

  buttons.regenerate?.addEventListener("click", resetGeneration);

  buttons.prevPage?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Prev button clicked, currentIndex:", currentPageIndex, "disabled:", buttons.prevPage?.disabled);
    // Check if button is disabled
    if (buttons.prevPage?.disabled) {
      console.log("Prev button is disabled, ignoring click");
      return;
    }
    // Ensure we have valid page data before navigating
    if (Array.isArray(bookPages) && currentPageIndex > 0) {
      currentPageIndex -= 1;
      console.log("Navigating to page:", currentPageIndex);
      updateBookDisplay();
    } else {
      console.log("Cannot navigate: bookPages:", bookPages, "currentPageIndex:", currentPageIndex);
    }
  });

  buttons.nextPage?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Next button clicked, currentIndex:", currentPageIndex, "disabled:", buttons.nextPage?.disabled);
    // Check if button is disabled
    if (buttons.nextPage?.disabled) {
      console.log("Next button is disabled, ignoring click");
      return;
    }
    // Ensure we have valid page data before navigating
    const total = getTotalPages();
    console.log("Total pages:", total, "bookPages length:", bookPages.length);
    if (currentPageIndex < total - 1) {
      const targetIndex = currentPageIndex + 1;
      if (currentPageIndex === 0) {
        console.log("Opening cover, navigating to page:", targetIndex);
        playCoverOpeningAnimation(targetIndex);
      } else {
        currentPageIndex = targetIndex;
        console.log("Navigating to page:", currentPageIndex);
        updateBookDisplay();
      }
    } else {
      console.log("Cannot navigate: already at last page");
    }
  });

  buttons.downloadPdf?.addEventListener("click", handleDownloadPdf);
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
    // Show the view immediately and update display with current data
    updateBookDisplay();
    scrollTo({ top: 0, behavior: "smooth" });
    
    // Then refresh book pages in the background
    // Don't reset currentPageIndex if user is already viewing a page
    const wasOnCover = currentPageIndex === 0;
    fetchBookPages()
      .then(() => {
        // If user was on cover, keep them on cover; otherwise preserve their position
        if (wasOnCover && bookPages.length > 0) {
          currentPageIndex = 0;
        }
        updateBookDisplay();
      })
      .catch((error) => {
        // Even if fetch fails, update display with existing/empty pages
        console.error("Error fetching book pages:", error);
        updateBookDisplay();
      });
  }
}

async function fetchBookPages() {
  // Store current state to preserve it if fetch fails
  const previousPages = [...bookPages];
  const previousIndex = currentPageIndex;
  
  try {
    // Add cache-busting to ensure fresh data
    // Add timeout to prevent hanging (20 seconds - reduced for faster failure)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    // Explicitly set limit to 10 to prevent timeouts
    let response;
    try {
      response = await fetch(`/api/artwork?limit=10&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // If fetch fails or times out, try without images as fallback
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('timeout')) {
        console.warn("Initial fetch timed out, trying without images...");
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 15000);
        try {
          response = await fetch(`/api/artwork?limit=10&includeImages=false&t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            },
            signal: fallbackController.signal
          });
          clearTimeout(fallbackTimeout);
        } catch (fallbackError) {
          clearTimeout(fallbackTimeout);
          throw new Error('Request timeout. Unable to load artwork. Please try again later.');
        }
      } else {
        throw fetchError;
      }
    }
    
    if (!response.ok) {
      // Check for timeout errors
      if (response.status === 504) {
        // Try fallback without images
        console.warn("Request timed out with images, trying without images...");
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 15000);
        try {
          response = await fetch(`/api/artwork?limit=10&includeImages=false&t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            },
            signal: fallbackController.signal
          });
          clearTimeout(fallbackTimeout);
          if (!response.ok) {
            throw new Error('Request timeout. Unable to load artwork.');
          }
        } catch (fallbackError) {
          clearTimeout(fallbackTimeout);
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Request timeout. The database query took too long. Please try again later.');
        }
      } else {
        throw new Error(`Failed to load artwork: ${response.status}`);
      }
    }
    const data = await response.json();
    // Only use fallback if we get an empty array - don't use fallback if we have real data
    if (Array.isArray(data) && data.length > 0) {
      const entries = data.map(normalizeEntry).filter(Boolean);
      if (entries.length > 0) {
        bookPages = entries;
      } else {
        // If normalization filtered everything out, keep existing pages
        console.warn("All entries were filtered out during normalization");
        bookPages = previousPages.length > 0 ? previousPages : [];
      }
    } else {
      // Empty array from database - keep previous pages if available
      console.log("No artwork found in database");
      bookPages = previousPages.length > 0 ? previousPages : [];
    }
  } catch (error) {
    console.error("Unable to load book pages from Supabase", error);
    // On error, keep previous pages so buttons still work
    bookPages = previousPages.length > 0 ? previousPages : [];
    
    // Show user-friendly error message for timeouts
    if (error.name === 'AbortError' || error.message?.includes('timeout') || error.message?.includes('504')) {
      showStatus('Request timed out. Showing available pages. Please try again later.', true, true);
    } else if (error.message) {
      // Show other errors too, but less prominently
      console.warn("Fetch error details:", error.message);
    }
    
    // Re-throw to allow caller to handle
    throw error;
  }

  // Only adjust currentPageIndex if necessary, don't reset it unnecessarily
  if (!Number.isInteger(currentPageIndex) || currentPageIndex < 0) {
    currentPageIndex = 0;
  } else {
    // Ensure index is within bounds but don't reset if it was valid
    const maxIndex = Math.max(0, getTotalPages() - 1);
    if (currentPageIndex > maxIndex) {
      currentPageIndex = maxIndex;
    }
  }
}

async function handleGenerate(event) {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showStatus(t("status.missingPrompt"), true);
    return;
  }

  const styledPrompt = composePrompt(prompt);

  toggleFormDisabled(true);
  showStatus(t("status.generating"), false, true);
  resultSection.classList.add("hidden");
  resultSection.classList.add("loading");
  resultSection.setAttribute("data-loading-label", t("status.generatingShort"));

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
    showStatus(t("status.success"), false, true);
    resultSection.setAttribute("data-loading-label", "");
  } catch (error) {
    console.error(error);
    showStatus(t("status.error"), true);
  } finally {
    toggleFormDisabled(false);
    resultSection.classList.remove("loading");
  }
}

async function generateImage(prompt) {
  if (shouldUseCustomBackend()) {
    return generateViaBackend(prompt);
  }
  return generateViaPollinations(prompt);
}

async function addLatestGenerationToBook(kidName, story) {
  if (!latestGeneration) return;

  const payload = {
    kidName,
    story,
    prompt: latestGeneration.prompt,
    imageUrl: latestGeneration.imageUrl,
  };

  try {
    const response = await fetch("/api/artwork", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to save artwork");
    }

    // Get the saved entry from the response
    const savedEntry = await response.json();
    
    // Add the new entry to bookPages immediately without refetching all pages
    if (savedEntry && savedEntry.id) {
      const normalizedEntry = normalizeEntry(savedEntry);
      if (normalizedEntry) {
        // Check if entry already exists (avoid duplicates)
        const existsIndex = bookPages.findIndex(p => p.id === normalizedEntry.id);
        if (existsIndex >= 0) {
          // Update existing entry
          bookPages[existsIndex] = normalizedEntry;
        } else {
          // Add new entry
          bookPages.push(normalizedEntry);
        }
        // Sort by created_at to maintain chronological order
        bookPages.sort((a, b) => {
          const dateA = new Date(a.generatedAt || 0);
          const dateB = new Date(b.generatedAt || 0);
          return dateA - dateB;
        });
      }
    }
    
    // Try to refresh in background, but don't block on it
    // This ensures we have the latest data, but doesn't prevent the save from completing
    fetchBookPages().catch(err => {
      console.warn("Background refresh failed, using cached data:", err);
    });
    
    currentPageIndex = getTotalPages() - 1;
    updateBookDisplay();
    showView("book");
    highlightNewPage();
  } catch (error) {
    console.error("Unable to save artwork to Supabase", error);
    showStatus(t("status.saveError"), true, true);
    throw error;
  }
}

function updateBookDisplay() {
  const totalPages = getTotalPages();
  const hasEntries = Array.isArray(bookPages) && bookPages.length > 0;
  const onCover = currentPageIndex === 0 || !hasEntries;

  // Update button states - ensure buttons are enabled/disabled correctly
  if (buttons.prevPage) {
    buttons.prevPage.disabled = currentPageIndex === 0;
    // Remove disabled attribute if not disabled to ensure clickability
    if (!buttons.prevPage.disabled) {
      buttons.prevPage.removeAttribute('disabled');
    }
  }
  if (buttons.nextPage) {
    buttons.nextPage.disabled = currentPageIndex >= totalPages - 1;
    // Remove disabled attribute if not disabled to ensure clickability
    if (!buttons.nextPage.disabled) {
      buttons.nextPage.removeAttribute('disabled');
    }
  }

  if (!hasEntries) {
    showCover();
    return;
  }

  if (onCover) {
    showCover();
    return;
  }

  showBookPage();
  const entryIndex = currentPageIndex - 1;
  const pageData = bookPages[entryIndex];
  if (pageData) {
    renderPageContent(pageData);
  } else {
    renderPageContent(null);
  }

  const indicatorTemplate = t("book.pageIndicator");
  const renderedIndicator = indicatorTemplate
    .replace("{current}", currentPageIndex)
    .replace("{total}", Math.max(totalPages - 1, 1));
  pageIndicator.textContent = renderedIndicator;
}

function showCover() {
  bookCoverDisplay?.classList.remove("hidden");
  bookPage?.classList.add("hidden");
  pageIndicator.textContent = "";

  renderPageContent(null);
}

function showBookPage() {
  bookCoverDisplay?.classList.add("hidden");
  bookPage?.classList.remove("hidden");
}

function renderPageContent(pageData) {
  if (!pageElements?.container) return;

  const isEmpty = !pageData;
  pageElements.container.classList.toggle("empty", isEmpty);

  if (isEmpty) {
    if (pageElements.image) {
      pageElements.image.src = "";
      pageElements.image.classList.add("hidden");
      pageElements.image.alt = "";
    }
    pageElements.kidName.textContent = "—";
    pageElements.date.textContent = "—";
    pageElements.prompt.textContent = t("book.page.emptyMessage");
    return;
  }

  if (pageElements.image) {
    // Add cache-busting to image URL to prevent showing old cached images
    let imageUrl = pageData.imageUrl;
    if (imageUrl && !imageUrl.includes('cacheBust=') && !imageUrl.startsWith('data:')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      imageUrl = `${imageUrl}${separator}cacheBust=${Date.now()}`;
    }
    pageElements.image.src = imageUrl;
    pageElements.image.alt = pageData.prompt;
    pageElements.image.classList.remove("hidden");
  }

  pageElements.kidName.textContent = pageData.kidName;
  pageElements.date.textContent = formatDate(pageData.generatedAt);
  pageElements.prompt.textContent = pageData.story || pageData.prompt || "—";
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

function getTotalPages() {
  if (!Array.isArray(bookPages)) return 1;
  return 1 + bookPages.length;
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
  resultSection.setAttribute("data-loading-label", "");
  resultSection.classList.remove("loading");
  hideStatus();
}

function highlightNewPage() {
  const spreadDisplay = document.querySelector(".page-display");
  if (!spreadDisplay) return;
  spreadDisplay.classList.add("recently-added");
  setTimeout(() => {
    spreadDisplay.classList.remove("recently-added");
  }, 2800);
}

function setupLanguage() {
  setLanguage(currentLanguage);
  languageToggle?.addEventListener("click", () => {
    const nextLanguage = currentLanguage === "ar" ? "en" : "ar";
    setLanguage(nextLanguage);
  });
}

function setLanguage(lang) {
  currentLanguage = translations[lang] ? lang : "en";
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    }
  } catch {
    // ignore storage errors
  }

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("lang-ar", currentLanguage === "ar");

  applyTranslations();
  updateBookDisplay();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = t(key);
    if (translation) {
      element.textContent = translation;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    const translation = t(key);
    if (translation) {
      element.setAttribute("placeholder", translation);
    }
  });

  if (languageToggle) {
    if (currentLanguage === "ar") {
      languageToggle.textContent = "English";
      languageToggle.setAttribute("aria-label", "Switch to English");
    } else {
      languageToggle.textContent = "العربية";
      languageToggle.setAttribute("aria-label", "التبديل إلى العربية");
    }
  }
}

function t(key) {
  const langPack = translations[currentLanguage] || translations.en;
  return langPack[key] ?? translations.en[key] ?? key;
}

function loadStoredLanguage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "ar" || stored === "en") {
        return stored;
      }
    }
  } catch {
    // ignore storage read errors
  }

  const browserLanguage =
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language.toLowerCase()
      : "en";

  return browserLanguage.startsWith("ar") ? "ar" : "en";
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const rawImage = entry.imageUrl ?? entry.image_url ?? "";
  const normalizedImage =
    typeof rawImage === "string" && rawImage.length
      ? rawImage.startsWith("http") || rawImage.startsWith("data:")
        ? rawImage
        : dataUrlFromBase64(rawImage)
      : "";
  return {
    id: entry.id ?? entry.uuid ?? makeId(),
    kidName: entry.kidName ?? entry.kid_name ?? "—",
    story: entry.story ?? entry.prompt ?? "",
    prompt: entry.prompt ?? entry.story ?? "",
    imageUrl: normalizedImage,
    originalPrompt: entry.originalPrompt ?? entry.prompt ?? entry.story ?? "",
    generatedAt: entry.generatedAt ?? entry.created_at ?? new Date().toISOString().slice(0, 10),
  };
}

function renderEntryForIndex(pageIndex) {
  if (pageIndex <= 0) return;
  const entryIndex = pageIndex - 1;
  const pageData = bookPages[entryIndex];
  renderPageContent(pageData ?? null);
}

function playCoverOpeningAnimation(targetIndex) {
  const container = pageDisplay;
  renderEntryForIndex(targetIndex);
  currentPageIndex = targetIndex;
  updateBookDisplay();
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

// PDF Generation Functions
async function handleDownloadPdf() {
  if (!buttons.downloadPdf) return;
  
  const originalText = buttons.downloadPdf.textContent;
  buttons.downloadPdf.disabled = true;
  buttons.downloadPdf.textContent = t("status.generatingPdf");

  try {
    let pagesToUse = bookPages; // Default to cached pages
    
    // Try to fetch from API, but fall back to cached data on timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`/api/pdf?limit=10&t=${Date.now()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.pages && data.pages.length > 0) {
          // If images were excluded due to timeout, merge with cached images
          if (data.imagesExcluded && bookPages.length > 0) {
            pagesToUse = data.pages.map(page => {
              const cachedPage = bookPages.find(p => p.id === page.id);
              return cachedPage ? { ...page, imageUrl: cachedPage.imageUrl } : page;
            });
          } else {
            pagesToUse = data.pages;
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.useClientCache && bookPages.length > 0) {
          console.log("API suggested using client cache, using cached pages");
        } else if (bookPages.length === 0) {
          throw new Error("No pages available to create PDF");
        }
      }
    } catch (fetchError) {
      // On fetch error (including timeout), use cached data
      if (fetchError.name === 'AbortError') {
        console.log("PDF API timed out, using cached pages");
      } else {
        console.warn("PDF API error, using cached pages:", fetchError.message);
      }
      
      if (bookPages.length === 0) {
        throw new Error("No pages available to create PDF");
      }
    }

    if (pagesToUse.length === 0) {
      throw new Error("No pages available to create PDF");
    }

    await generatePDF(pagesToUse);
    showStatus(t("status.pdfReady"), false, false);
  } catch (error) {
    console.error("PDF generation error:", error);
    showStatus(t("status.pdfError"), true, false);
  } finally {
    buttons.downloadPdf.disabled = false;
    buttons.downloadPdf.textContent = originalText;
  }
}

async function generatePDF(pages) {
  const { jsPDF } = window.jspdf;
  
  // A4 size in mm: 210 x 297
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Colors matching the website
  const greenDark = [6, 77, 49];    // #064d31
  const greenMain = [11, 105, 68];  // #0b6944
  const textMuted = [4, 42, 28, 0.7];
  const gold = [247, 201, 72];      // #f7c948

  // Load fonts - use built-in fonts
  doc.setFont("helvetica");

  // --- COVER PAGE ---
  await addCoverPage(doc, pageWidth, pageHeight, margin, greenDark, greenMain, gold);

  // --- CONTENT PAGES ---
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    doc.addPage();
    await addContentPage(doc, page, i + 1, pages.length, pageWidth, pageHeight, margin, contentWidth, greenDark, greenMain);
  }

  // Save the PDF
  const fileName = `Saudi-Talent-Book-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

async function addCoverPage(doc, pageWidth, pageHeight, margin, greenDark, greenMain, gold) {
  // Background gradient effect (simplified)
  doc.setFillColor(246, 247, 239); // #f6f7ef
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add gradient-like effect at top
  doc.setFillColor(186, 163, 195); // Soft purple-pink for sky
  doc.rect(0, 0, pageWidth, pageHeight * 0.4, "F");
  
  doc.setFillColor(232, 196, 177); // Soft peach for sunset
  doc.rect(0, pageHeight * 0.35, pageWidth, pageHeight * 0.15, "F");

  // Try to load and add the cover image
  try {
    const coverImg = await loadImage("/assets/images/newCover.jpg");
    if (coverImg && coverImg.data) {
      // Calculate dimensions to fit the page
      const imgRatio = coverImg.width / coverImg.height;
      const targetHeight = pageHeight;
      const targetWidth = targetHeight * imgRatio;
      
      // Center the image
      const xOffset = (pageWidth - targetWidth) / 2;
      doc.addImage(coverImg.data, "JPEG", xOffset, 0, targetWidth, targetHeight);
    }
  } catch (err) {
    console.warn("Could not load cover image, using text-only cover:", err);
    
    // Fallback: Text-only cover
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(...greenDark);
    doc.text("Future Saudi", pageWidth / 2, pageHeight * 0.25, { align: "center" });
    doc.text("Through Our Eyes", pageWidth / 2, pageHeight * 0.32, { align: "center" });
    
    // Subtitle
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text("Dreams of tomorrow, painted by the children of today", pageWidth / 2, pageHeight * 0.42, { align: "center" });
    
    // Decorative elements
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.line(margin + 20, pageHeight * 0.5, pageWidth - margin - 20, pageHeight * 0.5);
    
    // Saudi Talent Paint branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...greenMain);
    doc.text("Saudi Talent Paint", pageWidth / 2, pageHeight * 0.85, { align: "center" });
  }
}

async function addContentPage(doc, pageData, pageNum, totalPages, pageWidth, pageHeight, margin, contentWidth, greenDark, greenMain) {
  // Page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Subtle gradient at top
  doc.setFillColor(244, 251, 255); // Very light blue
  doc.rect(0, 0, pageWidth, 60, "F");

  // Header with page number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...greenMain);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, margin, { align: "center" });

  let yPosition = margin + 15;

  // Kid's name - prominent styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...greenDark);
  const madeByText = currentLanguage === "ar" ? `من إبداع ${pageData.kidName}` : `Made by ${pageData.kidName}`;
  doc.text(madeByText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const dateText = formatDate(pageData.generatedAt);
  doc.text(dateText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // Image
  const imageMaxWidth = contentWidth * 0.85;
  const imageMaxHeight = 110;
  
  if (pageData.imageUrl) {
    try {
      const img = await loadImage(pageData.imageUrl);
      if (img && img.data) {
        // Calculate dimensions maintaining aspect ratio
        const imgRatio = img.width / img.height;
        let imgWidth = imageMaxWidth;
        let imgHeight = imgWidth / imgRatio;
        
        if (imgHeight > imageMaxHeight) {
          imgHeight = imageMaxHeight;
          imgWidth = imgHeight * imgRatio;
        }
        
        const imgX = (pageWidth - imgWidth) / 2;
        
        // Add shadow effect (rounded rectangle behind image)
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 5, 5, "F");
        
        // Add image with border
        doc.addImage(img.data, "JPEG", imgX, yPosition, imgWidth, imgHeight);
        
        // Border
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(3);
        doc.roundedRect(imgX, yPosition, imgWidth, imgHeight, 4, 4, "S");
        
        yPosition += imgHeight + 15;
      }
    } catch (err) {
      console.warn("Could not load image for page", pageNum, err);
      // Placeholder for missing image
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(margin + 20, yPosition, contentWidth - 40, 80, 4, 4, "F");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Image not available", pageWidth / 2, yPosition + 40, { align: "center" });
      yPosition += 95;
    }
  }

  // Story label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...greenDark);
  const storyLabel = currentLanguage === "ar" ? "القصة:" : "Story:";
  doc.text(storyLabel, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Story content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  const storyText = pageData.story || pageData.prompt || "—";
  const lines = doc.splitTextToSize(storyText, contentWidth - 20);
  
  // Calculate text height
  const lineHeight = 6;
  const textHeight = lines.length * lineHeight;
  
  // Story box background
  doc.setFillColor(250, 250, 245);
  doc.roundedRect(margin + 5, yPosition - 3, contentWidth - 10, textHeight + 10, 3, 3, "F");
  
  // Story text
  doc.text(lines, pageWidth / 2, yPosition + 4, { align: "center", lineHeightFactor: 1.5 });

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Saudi Talent Paint • Saudi Kids x AI", pageWidth / 2, pageHeight - 10, { align: "center" });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      // Convert to canvas to get data URL
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({
          data: dataUrl,
          width: img.width,
          height: img.height,
        });
      } catch (err) {
        // CORS issue - try direct
        resolve({
          data: src,
          width: img.width,
          height: img.height,
        });
      }
    };
    
    img.onerror = () => {
      // If it's already a data URL, try to use it directly
      if (src.startsWith("data:")) {
        resolve({
          data: src,
          width: 400,
          height: 300,
        });
      } else {
        reject(new Error("Failed to load image"));
      }
    };
    
    // Handle data URLs directly
    if (src.startsWith("data:")) {
      img.src = src;
    } else {
      // Add cache busting for regular URLs
      const separator = src.includes("?") ? "&" : "?";
      img.src = `${src}${separator}t=${Date.now()}`;
    }
  });
}

