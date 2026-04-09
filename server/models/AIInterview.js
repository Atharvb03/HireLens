import mongoose from 'mongoose'

const aiInterviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewLink: { type: String, required: true },
  interviewToken: { type: String, unique: true, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'expired'],
    default: 'pending'
  },
  score: { type: Number, default: null },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  feedback: { type: String, default: null },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true },
  emailSent: { type: Boolean, default: false },
  dashboardNotified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('AIInterview', aiInterviewSchema)
