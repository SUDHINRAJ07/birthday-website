# SurpriseLink – Personalized Digital Surprise Card & Webpage Generator 💌

A full-stack, production-ready web application inspired by the digital surprise experience of HeartCraft and CutiePage. Users can craft personalized interactive cards and love letters with custom music, animations, stickers, and photos, and generate unique shareable links (`/s/<slug>`) that recipients can open on mobile or desktop without needing an app or login.

---

## ✨ Features

- **10 Curated Occasion Categories:**
  - 🎂 Birthday Wishes
  - 💖 Love & Romance
  - 💍 Anniversary
  - ✨ Marriage Proposal
  - 🥺 Sorry / Apology
  - 👯 Friendship
  - 💐 Thank You
  - 🌹 Valentine's Day
  - 📸 Special Memories
  - 🪄 Custom Surprise
- **Real-Time Interactive Editor:**
  - Dynamic live phone mockup preview
  - Color palettes and smooth gradient themes
  - Curated fonts (Romantic Serif, Handwritten Script, Modern Clean, Elegant Calligraphy)
  - Interactive stickers & doodle attachments
  - Multi-photo upload support
  - Background music synthesizer using Web Audio API (Zero external MP3 dependencies)
- **Unique Shareable URLs:**
  - Cryptographically secure 8-character random slugs (`/s/7f8a92bc`)
  - Instant QR Code generator for quick camera scanning
  - 1-Click WhatsApp share and clipboard copy
- **Recipient Experience:**
  - Floating romantic particles background
  - 3D interactive wax-sealed envelope ("Tap to Open")
  - Realistic physics confetti explosion
  - Automatic background melody playback on envelope open
  - Polaroid photo gallery with tilt animation
- **Creator Dashboard & Management:**
  - Track total surprises and opens
  - Save drafts and published links
  - Edit or delete creations
  - Secure authentication with password hashing

---

## 🛠️ Technology Stack

- **Frontend:** Vanilla HTML5, CSS3 (Custom design system, animations, responsive grid), Vanilla JavaScript (No heavy frameworks)
- **Backend:** Python 3, Flask 3
- **Database:** MySQL (SQLAlchemy ORM with local SQLite zero-config fallback)
- **Audio:** Web Audio API Synthesizer (Generates crystal-clear melodies directly in the browser)
- **Deployment:** Render (with Gunicorn and environment variables)

---

## 🚀 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "birthday greeting"
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment (Optional):**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: If `DATABASE_URL` is not provided, the application automatically uses a local SQLite database (`surpriselink.db`) and auto-seeds all 10 categories.*

4. **Run the Application:**
   ```bash
   python app.py
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.

5. **Run Automated Tests:**
   ```bash
   python -m unittest test_app.py
   ```

---

## 🌐 Staging Deployment on Render

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SurpriseLink application"
   git branch -M main
   git remote add origin https://github.com/<your-username>/surpriselink.git
   git push -u origin main
   ```

2. **Create a Web Service on Render:**
   - Link your GitHub repository.
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`

3. **Environment Variables on Render:**
   - `SECRET_KEY`: Set to a strong random string
   - `DATABASE_URL`: Add your hosted MySQL connection string (e.g., `mysql+pymysql://user:pass@host:3306/surpriselink` from Aiven, PlanetScale, or Render Postgres/MySQL)
   - `FLASK_ENV`: `production`

---

## 📂 Folder Structure

```
surpriselink/
├── app.py                   # Application factory, seeds, and entry point
├── config.py                # Database and upload configuration
├── requirements.txt         # Production dependencies
├── Procfile                 # Deployment process command for Render
├── test_app.py              # Automated test suite
├── models/
│   ├── database.py          # SQLAlchemy instance
│   ├── user.py              # User model with password hashing
│   ├── category.py          # Category & Template models
│   ├── surprise.py          # Surprise & SurpriseImage models
│   └── settings.py          # SurpriseSettings model
├── routes/
│   ├── main_routes.py       # Home, Categories, Template gallery
│   ├── auth_routes.py       # Login, Register, Logout
│   ├── surprise_routes.py   # Editor, Drafts, Dashboard, Success
│   └── public_routes.py     # Public recipient view (/s/<slug>)
├── static/
│   ├── css/
│   │   ├── app.css          # Theme styles, buttons, navigation
│   │   ├── editor.css       # Editor controls & live phone mockup
│   │   └── surprise.css     # 3D interactive envelope & confetti
│   ├── js/
│   │   ├── app.js           # Toast alerts, clipboard, WhatsApp share
│   │   ├── editor.js        # Real-time preview synchronizer
│   │   ├── surprise.js      # Recipient unboxing & particle effects
│   │   └── audio.js         # Web Audio API melody synthesizer
│   └── uploads/             # User photo storage (.gitkeep)
└── templates/
    ├── base.html            # Base master layout
    ├── index.html           # 1. Home Page
    ├── auth.html            # 2. Login & Register Page
    ├── dashboard.html       # 3. User Dashboard
    ├── categories.html      # 4 & 5. Category Selection Page
    ├── templates.html       # 6. Template Gallery
    ├── editor.html          # 7 & 12. Card Editor / Edit Page
    ├── preview.html         # 8. Live Preview Page
    ├── success.html         # 9. Submit Success Page
    ├── surprise.html        # 10. Shared Surprise Page
    ├── my_creations.html    # 11. My Creations Page
    └── 404.html             # 13. 404 Not Found Page
```
