import mongoose from 'mongoose'

const interviewSessionSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  jobDescription: { type: String },
  requiredSkills: [String],
  candidateSkills: [String],
  interviewToken: { type: String, unique: true, required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'expired'],
    default: 'pending'
  },
  finalScore: { type: Number, default: null },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('InterviewSession', interviewSessionSchema)
