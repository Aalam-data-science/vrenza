# VIRENZA — Healthcare Intelligence & Coordination Infrastructure

> **VIRENZA** is an enterprise-grade multimodal healthcare coordination and clinical intelligence platform. It unifies patients, clinicians, hospital networks, emergency response fleets, and health systems with real-time geospatial telemetry, voice AI, and generative clinical tools.

---

## 📋 Overview

Modern healthcare delivery demands rapid coordination across distributed systems. **VIRENZA** addresses this by bridging emergency operations, patient health records, clinical triage, and multimodal generative AI into a unified, responsive interface:

- **Emergency Operations & Geospatial Radar**: Interactive geospatial fleet and facility tracking across Level I trauma centers, mobile ICU ambulances, triage clinics, and 24/7 pharmacies.
- **Multimodal Clinical Intelligence**: Diagnostic support analyzing medical scans (X-Ray, CT, MRI), lab records, and doctor-patient dialogue via the Google Gen AI SDK (`@google/genai`).
- **Live Bidirectional Voice Consultations**: Sub-second, low-latency clinical communication using WebSockets and the Gemini Live API for hands-free clinical encounters.
- **Ambient Transcription & Grounding**: Automated clinical note generation using speech-to-text paired with Google Search and Google Maps grounding for verified medical references and facility routing.
- **Medical Media Studio**: High-resolution anatomical diagram generation with Imagen and procedural clinical training video synthesis with Veo 3.
- **Enterprise Persistence & RBAC**: Real-time multi-tenant synchronization and role-based access control powered by Firebase Authentication and Cloud Firestore.

---

## ✨ Key Features

### 1. 🗺️ Geospatial Fleet & Facilities Radar
- **Real-Time Facility Telemetry**: Live map rendering Level I Trauma Centers, regional specialty clinics, and 24/7 pharmacies.
- **Mobile Fleet Dispatch**: Dynamic tracking of Ambulance Units, triage severity, transit times, and patient destination assignments.
- **Filtering & Status Monitoring**: Instant toggle across facility readiness, ICU bed capacity, and emergency alert tiers.
- Built with `@googlemaps/js-api-loader` and responsive map controls.

### 2. 🧠 Multimodal AI & Clinical Intelligence
- **Diagnostic Vision**: Multi-image comparative analysis for radiography and pathology imaging (`gemini-3.1-pro-preview`).
- **Live Voice Consultations**: Sub-second bidirectional streaming voice audio via WebSockets and raw PCM 16kHz audio capture (`gemini-2.0-flash-exp` / Gemini Live).
- **Ambient Consultation Transcription**: Speech-to-Text (`gemini-3.5-transcribe`) converting clinical audio into structured SOAP notes.
- **Grounded Intelligence**: Verified citations and medical literature retrieval backed by Google Search and Google Maps tools (`gemini-3.5-flash`).

### 3. 🎥 Medical Media Studio
- **Imagen Visual Generator**: High-fidelity anatomical diagrams, surgical planning graphics, and patient education visual assets across configurable aspect ratios (`1:1`, `4:3`, `16:9`).
- **Veo 3 Video Studio**: Text-to-video and photo-to-video clinical simulation and procedural training animations (`veo-3.1-fast-generate-preview`).

### 4. 👥 Multi-Role Portals & Dashboards
- **Patient Portal**: Medical history, active prescriptions, appointments, and self-assessment intake tools.
- **Clinician Hub**: Patient triage queues, treatment plans, diagnostic workflows, and AI assistants.
- **Operations & Fleet Center**: Resource utilization, ambulance dispatch status, and regional emergency routing.
- **Enterprise & Admin Suite**: Hospital bed analytics, audit logs, and security monitoring.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Language** | TypeScript (Strict) | 100% typed frontend components, backend proxy routes, and schemas |
| **Frontend Framework** | React 19 + Vite | Modular functional components, custom hooks, and fast HMR bundling |
| **Styling & Icons** | Tailwind CSS v4 + Lucide React | Modern medical UI, responsive layouts, accessible typography |
| **Backend & Real-Time** | Node.js + Express + WebSockets (`ws`) | Server-side proxy for Gemini Live API streaming and secure endpoints |
| **Database & Auth** | Firebase (Firestore + Auth) | Real-time multi-tenant data sync, secure user identity, and security rules |
| **Mapping Engine** | Google Maps JavaScript API | Interactive geospatial telemetry and facility fleet visualization |
| **AI / GenAI SDK** | `@google/genai` (Google Gen AI SDK) | Gemini 3.5, Gemini 3.1 Pro/Flash, Imagen 3, Veo 3 |

---

## 📂 Project Structure

```text
├── src/
│   ├── components/         # Reusable UI widgets, modals, layout components
│   │   ├── GoogleFacilitiesMap.tsx  # Google Maps fleet & facility radar
│   │   ├── GeminiChatbotModal.tsx   # Interactive AI consultation assistant
│   │   ├── GeminiLiveModal.tsx      # Real-time bidirectional voice consultation
│   │   ├── MultimodalStudioModal.tsx# Imaging, video (Veo) & transcription studio
│   │   └── ...
│   ├── pages/              # Portal views
│   │   ├── admin/          # Admin management dashboards
│   │   ├── clinician/      # Doctor & clinical workflow pages
│   │   ├── enterprise/     # Health network & hospital analytics
│   │   ├── operations/     # Emergency radar & fleet dispatch
│   │   ├── patient/        # Patient records, check-ins, health summary
│   │   └── public/         # Landing page and public info
│   ├── services/           # Firebase, Gemini API, and audio streamer services
│   ├── hooks/              # Custom React hooks
│   ├── types.ts            # Core TypeScript data interfaces
│   ├── App.tsx             # Root routing and application layout
│   └── main.tsx            # React application entry point
├── server.ts               # Express server + WebSocket Gemini Live proxy
├── firestore.rules         # Firebase Cloud Firestore security rules
├── firebase-blueprint.json # Database structure and collection schemas
├── metadata.json           # Applet configuration and permissions
├── package.json            # Scripts & project dependencies
└── vite.config.ts          # Vite build and development configuration
```

---

## ⚙️ Environment Variables

Configure the required environment variables in a `.env` file at the root of the project:

```env
# Gemini API Key (Automatically injected in AI Studio)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Application Base URL
APP_URL="http://localhost:3000"

# Google Maps Platform Key (Used for Facilities & Fleet radar)
VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or later)
- **npm** or **bun**

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd virenza

# Install dependencies
npm install
```

### 3. Running in Development
```bash
npm run dev
```
> The application will start at `http://localhost:3000` with the Express server hosting backend routes and Vite middleware for the frontend.

### 4. Building for Production
```bash
# Build the production assets
npm run build

# Start the production server
npm start
```

### 5. Linting & Validation
```bash
npm run lint
```

---

## 🔒 Security & Compliance

- **Role-Based Access Control (RBAC)**: Fine-grained Firestore security rules ensure patient health information (PHI) is only accessible to authorized clinical personnel.
- **Server-Side API Key Isolation**: Sensitive API credentials remain securely on the server; client calls route through authenticated Express proxy endpoints.
- **Audio Privacy**: Live Voice sessions process raw PCM audio streams with explicit user microphone permissions and no unauthorized persistent audio storage.

---

## 📄 License

All rights reserved © VIRENZA Healthcare Intelligence Infrastructure.
