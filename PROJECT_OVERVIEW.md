# Saudi Talent Paint - Project Overview

## 🎯 Project Purpose
A web application that allows children to describe their vision of Saudi Arabia's future, which is then transformed into AI-generated artwork and compiled into a digital book.

---

## 🏗️ Architecture Overview

This is a **full-stack web application** with:
- **Frontend**: Vanilla JavaScript (ES6 modules) + HTML5 + CSS3
- **Backend**: Vercel Serverless Functions (for production) + Express.js (for local development)
- **Database**: Supabase (PostgreSQL)
- **AI Service**: OpenAI DALL·E 3 API

---

## 📁 File Structure & Explanation

### **Frontend Files**

#### `index.html`
**Purpose**: Main HTML structure and entry point
- Defines the page layout with three main views:
  1. **Landing Page** (`#landing`): Hero section with call-to-action buttons
  2. **Canvas View** (`#canvasView`): Form for generating new artwork
  3. **Book View** (`#bookView`): Digital book viewer with page navigation
- Includes a dialog modal for collecting kid's name and story
- Uses semantic HTML5 elements
- Implements internationalization (i18n) with `data-i18n` attributes for English/Arabic support

#### `assets/styles.css`
**Purpose**: Complete styling and responsive design
- **Design System**: Custom CSS variables for colors, fonts, spacing
- **Responsive Design**: Mobile-first approach with media queries
- **Key Features**:
  - Hero section with background image
  - Book viewer with page flip animations
  - RTL (Right-to-Left) support for Arabic
  - Loading states and transitions
  - Mobile-optimized layouts (max-width: 640px breakpoint)
- **Typography**: Uses Google Fonts (Baloo 2, Signika)

#### `assets/app.js`
**Purpose**: Main frontend JavaScript application logic
- **Module Type**: ES6 module (`type="module"`)
- **Key Functions**:
  - `initialize()`: Sets up the app, loads book pages, attaches event listeners
  - `showView(view)`: Switches between landing/canvas/book views
  - `handleGenerate()`: Handles image generation form submission
  - `addLatestGenerationToBook()`: Saves artwork to database
  - `updateBookDisplay()`: Manages book page navigation
  - `fetchBookPages()`: Retrieves all artwork from Supabase
  - `setLanguage()`: Handles English/Arabic language switching
- **State Management**: Uses module-level variables (no framework)
- **API Integration**: Communicates with Vercel serverless functions

#### `assets/config.js`
**Purpose**: Configuration for image generation
- Exports `diffusionConfig` object with:
  - Backend endpoint URL
  - Model settings (currently DALL·E 3)
  - Prompt prefixes/suffixes (adds Saudi Arabia context)
  - Style hints for consistent artwork quality
- Used by `app.js` to configure API calls

---

### **Backend Files (Vercel Serverless Functions)**

#### `api/generate.js`
**Purpose**: Vercel serverless function for AI image generation
- **Endpoint**: `POST /api/generate`
- **Technology**: Vercel Serverless Functions (Node.js runtime)
- **Functionality**:
  - Receives prompt from frontend
  - Calls OpenAI DALL·E 3 API
  - Returns image as base64 data URL
  - Handles CORS headers
  - Error handling and validation
- **Environment Variables**: Requires `OPENAI_API_KEY`

#### `api/artwork.js`
**Purpose**: Vercel serverless function for database operations
- **Endpoints**:
  - `GET /api/artwork`: Fetches all saved artwork
  - `POST /api/artwork`: Saves new artwork to database
- **Technology**: Supabase client library
- **Functionality**:
  - Connects to Supabase PostgreSQL database
  - CRUD operations on `kid_artwork` table
  - Normalizes data format between frontend and database
  - Handles CORS headers
- **Environment Variables**: Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

#### `api/health.js`
**Purpose**: Health check endpoint
- **Endpoint**: `GET /api/health`
- **Returns**: `{ status: "ok" }`
- Used for monitoring and deployment verification

---

### **Local Development Server**

#### `server/index.js`
**Purpose**: Express.js server for local development
- **Technology**: Express.js + Node.js
- **Port**: 4000 (default) or `process.env.PORT`
- **Endpoints**:
  - `GET /health`: Health check
  - `POST /generate`: Image generation (same as Vercel function)
- **Why it exists**: Allows testing backend functionality locally before deploying to Vercel
- **Environment Variables**: Requires `OPENAI_API_KEY` in `.env` file

#### `server/package.json`
**Purpose**: Dependencies for local development server
- Lists Express.js and related packages
- Separate from main `package.json` (which is for Vercel deployment)

---

### **Configuration Files**

#### `package.json`
**Purpose**: Project dependencies and metadata
- **Dependencies**:
  - `@supabase/supabase-js`: Supabase client library
  - `openai`: OpenAI API client
- Used by Vercel to install dependencies for serverless functions

#### `.gitignore`
**Purpose**: Specifies files to exclude from Git
- Excludes `server/.env` (contains API keys)
- Prevents committing sensitive credentials

---

## 🔧 Technologies & Frameworks

### **Frontend**
- **No Framework**: Pure vanilla JavaScript (ES6 modules)
- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties, flexbox, grid
- **Fonts**: Google Fonts (Baloo 2, Signika)

### **Backend**
- **Vercel Serverless Functions**: Production backend (serverless, auto-scaling)
- **Express.js**: Local development server
- **Node.js**: JavaScript runtime

### **Database**
- **Supabase**: PostgreSQL database with REST API
- **Table**: `kid_artwork` stores:
  - `id` (UUID)
  - `kid_name` (text)
  - `story` (text)
  - `prompt` (text)
  - `image_url` (text)
  - `created_at` (timestamp)

### **AI/ML**
- **OpenAI DALL·E 3**: Image generation model
- **API**: OpenAI Images API

### **Deployment**
- **Vercel**: Hosting platform for frontend and serverless functions
- **Environment Variables**: Stored in Vercel dashboard

---

## 🔄 Data Flow

1. **User Input**: Child describes a scene in the canvas view
2. **Image Generation**: 
   - Frontend sends prompt to `/api/generate`
   - Serverless function calls OpenAI DALL·E 3
   - Returns base64 image data
3. **Save to Book**:
   - User enters name and story
   - Frontend sends data to `/api/artwork` (POST)
   - Saved to Supabase database
4. **View Book**:
   - Frontend fetches all artwork from `/api/artwork` (GET)
   - Displays pages with navigation arrows
   - Shows cover page first, then individual pages

---

## 🌐 Internationalization (i18n)

- **Languages**: English (default) and Arabic
- **Implementation**: Custom JavaScript translation system
- **Storage**: LocalStorage for language preference
- **RTL Support**: CSS rules for right-to-left Arabic layout
- **Toggle**: Button in top-right corner of landing page

---

## 📱 Responsive Design

- **Mobile-First**: Designed for mobile devices first
- **Breakpoints**: 
  - Mobile: `max-width: 640px`
  - Tablet: `max-width: 960px`
  - Desktop: Default styles
- **Features**: Touch-friendly buttons, optimized layouts, readable text sizes

---

## 🔐 Security

- **API Keys**: Stored as environment variables (never in code)
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Server-side validation of user inputs
- **Error Handling**: Graceful error messages without exposing internals

---

## 🚀 Deployment

1. **Frontend**: Deployed to Vercel (static files)
2. **Backend**: Vercel serverless functions (auto-deployed)
3. **Database**: Supabase (cloud-hosted PostgreSQL)
4. **Environment Variables**: Configured in Vercel dashboard

---

## 📝 Key Features

✅ AI-powered image generation  
✅ Digital book viewer with page navigation  
✅ Multi-language support (English/Arabic)  
✅ Responsive mobile design  
✅ Persistent storage (Supabase)  
✅ Loading states and animations  
✅ Error handling and validation  

---

## 🎨 Design Philosophy

- **Child-Friendly**: Simple, colorful, engaging interface
- **Saudi Arabia Focus**: Prompts and styling emphasize Saudi landmarks and culture
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Optimized images, lazy loading, efficient API calls

