# CVInterview

CVInterview is an AI-powered interview simulation platform that matches a candidate's CV against a Job Description (JD), assesses their fit, and simulates a targeted interview based on the gaps found.

## Features
- **Gap Analysis**: Compares a candidate's CV against a Job Description to find matched skills, missing skills, and areas of overqualification.
- **Targeted Questions**: Generates personalized interview questions focusing on missing skills, behavioral aspects, and a reality check.
- **Voice Interview**: Simulates a live interview using the Web Speech API to capture answers.
- **Evaluation & Feedback**: Evaluates each answer individually and provides a comprehensive final report with a fit score and actionable advice.

## Technology Stack
- **Frontend**: ReactJS (Vite), TailwindCSS v3, Axios, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API (`gemini-1.5-flash` or `gemini-1.5-pro`)
- **PDF Parsing**: `pdf-parse`

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key

### Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Configure environment variables in `server/.env`.
4. Start the server: `npm start` (runs on port 5000)

### Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev` (runs on port 5173)

## Usage
1. Open the frontend URL in your browser.
2. Upload your CV (PDF) and paste the Job Description.
3. Review the AI-generated Gap Analysis.
4. Complete the simulated interview using your microphone.
5. Receive your detailed, honest final assessment report.
