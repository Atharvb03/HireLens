import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  resumeUrl: { type: String },
  resumeText: { type: String },
  availability: { type: String, enum: ['immediate', 'notice_period', 'other'], required: true },
  noticePeriod: { type: String },
  matchScore: { type: Number, default: 0 },
  skillMatchScore: { type: Number, default: 0 },
  semanticSimilarity: { type: Number, default: 0 },
  experienceMatch: { type: Number, default: 0 },
  educationMatch: { type: Number, default: 0 },
  projectRelevance: { type: Number, default: 0 },
  extractedSkills: [String],
  matchedSkills: [String],
  missingSkills: [String],
  overallAssessment: { type: String },
  strengths: [String],
  concerns: [String],
  matchSource: { type: String, enum: ['ai', 'ai-skills-regex-score', 'regex'], default: 'regex' },
  // AI-parsed resume structured data
  parsedResume: {
    name: String,
    email: String,
    phone: String,
    summary: String,
    totalYearsExperience: Number,
    skills: [String],
    experience: [{ company: String, title: String, duration: String, years: Number, description: String }],
    education: [{ institution: String, degree: String, year: String, gpa: String }],
    projects: [{ name: String, description: String, technologies: [String] }],
    certifications: [String]
  },
  rank: { type: Number },
  combinedScore: { type: Number, default: 0 }, // 40% matchScore + 60% interviewScore
  status: { type: String, enum: ['applied', 'screening', 'interviewed', 'rejected', 'hired'], default: 'applied' },
  statusUpdatedAt: { type: Date },
  statusNote: { type: String },
  interviewScore: { type: Number },
  feedback: { type: String },
  appliedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Candidate', candidateSchema)
