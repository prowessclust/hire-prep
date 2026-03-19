# 🎯 HirePrep

**HirePrep** is an AI-powered mock interview platform designed to help job seekers practice and prepare for technical interviews. The platform leverages cutting-edge AI technology to provide realistic interview experiences with real-time voice interactions and comprehensive feedback.

![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

---

## ✨ Features

### 🎙️ **AI-Powered Voice Interviews**

- **Vapi AI Integration**: Real-time voice-based interviews with natural conversational AI
- Live transcription and speech-to-text capabilities
- Dynamic interview flow with contextual follow-up questions
- Professional AI interviewer with realistic interaction patterns

### 📊 **Comprehensive Interview Management**

- Create customized interviews based on role, level, and tech stack
- Support for multiple interview types: Technical, Behavioral, and Mixed
- Track interview history with detailed metadata
- Visual interview cards with company logos and tech stack icons

### 🔐 **Secure Authentication**

- Firebase Authentication integration
- Separate sign-in and sign-up flows
- Protected routes for authenticated users
- User session management

### 📈 **Performance Feedback**

- AI-generated feedback on interview performance
- Category-wise scoring (Communication, Technical Knowledge, Problem Solving, etc.)
- Strengths and areas for improvement analysis
- Overall assessment with actionable insights

### 🎨 **Modern UI/UX**

- Dark mode interface with glassmorphic design
- Responsive layout for all device sizes
- Smooth animations and transitions
- Custom gradient backgrounds and patterns
- Tech stack visualization with icons

---

## 🏗️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Firebase** - Authentication and Firestore database
- **Vapi AI** - Voice-based AI interview agent
- **Google AI SDK** - AI-powered feedback generation
- **React Hook Form + Zod** - Form management and validation
- **Radix UI** - Accessible UI components

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ installed
- **npm** or **yarn** package manager
- **Firebase** project setup
- **Vapi AI** account and API key (for voice interviews)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hireprep
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # Firebase Admin (Server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_private_key

   # Vapi AI Configuration
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
   VAPI_PRIVATE_KEY=your_vapi_private_key

   # Google AI (for feedback generation)
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
hireprep/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/         # Sign-in page
│   │   └── sign-up/         # Sign-up page
│   ├── (root)/              # Main application routes
│   │   ├── interview/       # Interview pages
│   │   └── page.tsx         # Home/dashboard
│   ├── globals.css          # Global styles and Tailwind config
│   └── layout.tsx           # Root layout
├── components/
│   ├── Agent.tsx            # Vapi AI voice agent component
│   ├── AuthForm.tsx         # Authentication form
│   ├── InterviewCard.tsx    # Interview card component
│   ├── DisplayTechIcons.tsx # Tech stack icon display
│   ├── FormField.tsx        # Reusable form field
│   └── ui/                  # Shadcn UI components
├── constants/
│   └── index.ts             # App constants and configurations
├── firebase/
│   ├── client.ts            # Firebase client configuration
│   └── admin.ts             # Firebase admin configuration
├── lib/
│   └── utils.ts             # Utility functions
├── types/
│   ├── index.d.ts           # Global type definitions
│   └── vapi.d.ts            # Vapi AI type definitions
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

---

## 🎙️ Vapi AI Integration

HirePrep integrates **Vapi AI** to provide real-time voice-based interview experiences. The integration enables:

### **Features**

- **Real-time voice conversations** with AI interviewer
- **Live transcription** of both interviewer and candidate responses
- **Natural language processing** for contextual follow-ups
- **Call status management** (Inactive, Connecting, Active, Finished)
- **Visual feedback** with speaking animations

### **Implementation Details**

The Vapi integration is implemented in the `Agent.tsx` component:

```typescript
// Call status states
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
```

### **Type Definitions**

Custom TypeScript types for Vapi messages are defined in `types/vapi.d.ts`:

- **TranscriptMessage**: Real-time transcription data
- **FunctionCallMessage**: AI function invocations
- **MessageRoleEnum**: User, System, or Assistant roles
- **TranscriptMessageTypeEnum**: Partial or Final transcripts

### **Configuration**

The Vapi assistant configuration includes:

- **Transcriber**: Deepgram Nova-2 model for accurate speech recognition
- **Voice**: ElevenLabs with customizable voice parameters
- **Model**: OpenAI GPT-4 for intelligent conversation
- **System prompts**: Professional interviewer behavior guidelines

---

## 🔥 Firebase Integration

### **Authentication**

- Email/password authentication
- User session management
- Protected routes

### **Firestore Database**

Collections:

- `users` - User profiles
- `interviews` - Interview sessions
- `feedback` - AI-generated feedback

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```


