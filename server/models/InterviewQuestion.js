import mongoose from 'mongoose'

const interviewQuestionSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['mcq', 'short_answer', 'coding', 'descriptive'],
    default: 'short_answer'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  candidateAnswer: { type: String, default: null },
  score: { type: Number, default: null },
  feedback: { type: String, default: null },
  answeredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('InterviewQuestion', interviewQuestionSchema)
