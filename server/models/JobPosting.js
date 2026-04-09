import mongoose from 'mongoose'

const jobPostingSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [String],
  experience: { type: String },
  salary: { type: String },
  location: { type: String },
  vacancies: { type: Number, default: 1, min: 1 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('JobPosting', jobPostingSchema)
