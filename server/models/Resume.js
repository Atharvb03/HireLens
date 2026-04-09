import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  extractedData: {
    skills: [String],
    experience: [String],
    education: [String],
    summary: String
  },
  analysisScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Resume', resumeSchema)
