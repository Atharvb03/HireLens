# HireLens - AI-Powered Recruitment Platform

A full-stack recruitment automation platform built with React, Node.js, Express, MongoDB, and OpenAI API.

## Project Structure

```
hirelens/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── server.js
│   └── package.json
└── README.md
```

## Features

- **User Authentication**: Register/login for candidates and recruiters
- **Job Management**: Post and browse job listings
- **AI Resume Analysis**: Extract skills and experience using OpenAI
- **Candidate Matching**: Match candidates with jobs using AI
- **Interview Generation**: Auto-generate interview questions
- **Application Tracking**: Track candidate applications
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Setup

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
```

Create `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hirelens
OPENAI_API_KEY=your_key
JWT_SECRET=your_secret
PORT=5000
```

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (recruiter)
- `POST /api/candidates/apply` - Apply for job
- `POST /api/ai/analyze-resume` - Analyze resume
- `POST /api/ai/match-candidate` - Match candidate
- `POST /api/ai/generate-interview-questions` - Generate questions
