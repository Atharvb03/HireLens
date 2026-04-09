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
  rank: { type: Number },
  status: { type: String, enum: ['applied', 'screening', 'interviewed', 'rejected', 'hired'], default: 'applied' },
  interviewScore: { type: Number },
  feedback: { type: String },
  appliedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Candidate', candidateSchema)
