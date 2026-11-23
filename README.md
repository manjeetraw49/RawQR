# RawQR — Professional QR Code Generator

> **Scan It. Share It.**
> A modern, fast, minimalist QR code generation platform that allows anyone to create professional QR codes without technical knowledge.

---

## ✨ Features

- **🌐 Website URL to QR**: Convert any valid HTTP or HTTPS website address into an ISO-compliant, scannable QR code.
- **🖼️ Image to QR**: Upload high-resolution images (PNG, JPG, WebP) to cloud storage (Cloudinary or Supabase) and generate permanent, scannable QR links.
- **🎨 Custom Styling & Colors**: Real-time foreground and background hex color customization with built-in contrast safeguards to protect smartphone scannability.
- **✨ Center Logo Integration**: Embed custom brand logos or icons in the QR center with automatic Level-H error correction (30% redundancy) for bulletproof scanning.
- **📐 Shape Customization**: Toggle between curved, sharp square, and rounded dot corner styles.
- **💾 Dual Format Downloads**:
  - **PNG**: High-resolution raster export (1024×1024px) for screens and digital media (`rawqr-website.png` / `rawqr-image.png`).
  - **SVG**: Crisp mathematical vector format for infinite scaling on print, billboards, and merch (`rawqr-website.svg` / `rawqr-image.svg`).
- **🛡️ Privacy-First & Zero Redirects**: Real destination URLs are encoded directly into the QR matrix. No sneaky tracking domains, expiring redirect middle-men, or subscription locks.
- **📱 Fully Responsive**: Tailored SaaS experience for 1440px desktop, 1024px tablet, and 390px/360px mobile viewports.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons
- **QR Generation Engine**: `qr-code-styling` (canvas & vector SVG support, Level L/M/Q/H error correction)
- **Routing**: React Router v6 (Home, About, Contact, Privacy)
- **Backend**: Node.js & Express (Lightweight API for secure image upload & magic-byte binary validation)
- **Cloud Storage Options**:
  - **Cloudinary** (Default enterprise media CDN)
  - **Supabase Storage** (Alternative PostgreSQL-backed S3 bucket storage)
  - **Local Development Server** (Automatic zero-config fallback during local testing)

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/rawqr.git
cd RawQR

npm install
```

### 2. Configure Environment Variables (Optional for Cloud Storage)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

To enable cloud storage for the **Image to QR** feature:

#### Option A: Cloudinary (Recommended)
1. Sign up for free at [cloudinary.com](https://cloudinary.com).
2. Obtain your Cloud Name, API Key, and API Secret from your dashboard.
3. Add them to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

#### Option B: Supabase Storage
1. Create a project at [supabase.com](https://supabase.com).
2. Create a public storage bucket named `rawqr-images`.
3. Add your credentials to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_BUCKET=rawqr-images
   ```

*(Note: If no cloud credentials are provided, RawQR automatically operates in local development mode, storing uploads in `public/uploads` and serving them at `http://localhost:5000/uploads/...`)*

---

### 3. Run Development Servers

Run both the Express backend and the Vite frontend simultaneously:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

Or run them individually:
```bash
npm run client:dev   # Vite dev server
npm run server:dev   # Express API server with tsx hot-reloading
```

---

### 4. Build for Production

```bash
npm run build
```

This validates TypeScript types with `tsc -b` and produces optimized production assets in `dist/`.

---

## ⚡ Deployment on Vercel

RawQR is fully configured and ready for 1-click deployment on [Vercel](https://vercel.com):

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete RawQR generator with Vercel serverless support"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `RawQR` repository.
   - Vercel automatically detects **Vite**:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Configure Environment Variables** in Vercel Project Settings (*Settings > Environment Variables*):
   - Add your Cloudinary or Supabase credentials (for the Image-to-QR feature):
     ```env
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
     *(Or provide `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_BUCKET` if using Supabase)*

4. Click **Deploy**! 🚀
   - Client routes (`/`, `/about`, `/contact`, `/privacy`) are cleanly routed via `vercel.json`.
   - The `/api/upload` endpoint automatically runs as a high-performance Vercel Serverless Function with binary magic-byte inspection and cloud media hosting.

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## 📂 Project Architecture

```
RawQR/
├── public/
│   ├── favicon.svg          # Minimalist QR-inspired brand favicon
│   └── logo.svg             # RawQR vector logo
├── src/
│   ├── components/
│   │   ├── Header.tsx       # Navigation bar with brand logo & mobile menu
│   │   ├── Footer.tsx       # SaaS footer with tagline & links
│   │   ├── Toast.tsx        # Action notification container
│   │   └── Generator/
│   │       ├── GeneratorWorkspace.tsx  # Main 2-column workspace layout
│   │       ├── GeneratorTabs.tsx       # URL vs Image tab switcher
│   │       ├── UrlInput.tsx            # Validated HTTP/HTTPS input
│   │       ├── ImageUploader.tsx       # Drag-and-drop cloud upload zone
│   │       ├── ColorCustomizer.tsx     # Hex & picker foreground/background
│   │       ├── LogoUploader.tsx        # Center brand logo & size slider
│   │       ├── QRPreview.tsx           # Live preview & real-time canvas
│   │       └── DownloadButtons.tsx     # PNG & SVG download triggers
│   ├── sections/
│   │   ├── Hero.tsx         # Headline, subtitle & quick highlights
│   │   ├── HowItWorks.tsx   # 3-step walk-through
│   │   ├── Features.tsx     # 6 capability cards
│   │   └── FAQ.tsx          # 8 accurate FAQ accordion answers
│   ├── pages/
│   │   ├── Home.tsx         # Main landing page
│   │   ├── About.tsx        # Mission and vector standards
│   │   ├── Contact.tsx      # Interactive contact form & support info
│   │   └── Privacy.tsx      # Data handling & storage lifecycle policy
│   ├── hooks/
│   │   ├── useQRCode.ts     # QR reactive state & styling manager
│   │   └── useImageUpload.ts# File upload state, validation & progress
│   ├── services/
│   │   ├── qrService.ts     # qr-code-styling configuration builder
│   │   └── uploadService.ts # API client for /api/upload
│   ├── utils/
│   │   ├── validateUrl.ts   # Strict HTTP/HTTPS validation
│   │   ├── validateImage.ts # File extension & size limit checks
│   │   └── downloadQR.ts    # PNG & SVG export handler with fallbacks
│   ├── types/
│   │   └── qr.ts            # TypeScript interfaces & types
│   ├── styles/
│   │   └── globals.css      # Tailwind base, components & scrollbars
│   ├── App.tsx              # Router setup & scroll-to-top handler
│   └── main.tsx             # React DOM entry point
├── server/
│   └── index.ts             # Express backend with magic-byte image validation (local dev)
├── api/
│   ├── status.ts            # Vercel serverless health & storage provider status
│   └── upload.ts            # Vercel serverless function for image uploads
├── vercel.json              # Vercel routing, rewrites & SPA fallback config
├── .env.example             # Example environment variables
├── tailwind.config.js       # Design system colors, fonts & shadows
├── vite.config.ts           # Vite bundler & API proxy configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Scripts & dependencies
```

---

## 🔒 Security & Validation

1. **Magic-Byte Inspection**: Server inspects binary headers to guarantee files are authentic PNG (`89 50 4E 47`), JPEG (`FF D8 FF`), or WebP (`RIFF...WEBP`) before uploading.
2. **Size Enforcement**: 10MB strict ceiling on image uploads, 2MB on logo overlays.
3. **No Secret Leakage**: Cloudinary API keys and Supabase secret keys are kept strictly on the backend.
4. **URL Sanitization**: Prevents script injections or non-HTTP protocols (`javascript:`, `data:`).

---

## 📄 License

MIT License. Free to use for personal and commercial projects.
