import 'dotenv/config'

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import authRoutes from './routes/auth.js'
import jobRoutes from './routes/jobs.js'
import candidateRoutes from './routes/candidates.js'
import aiRoutes from './routes/ai.js'
import contactRoutes from './routes/contact.js'
import analysisRoutes from './routes/analysis.js'
import aiInterviewRoutes from './routes/aiInterview.js'
import interviewSessionRoutes from './routes/interviewSession.js'
import profileRoutes from './routes/profile.js'

const app = express()
const httpServer = createServer(app)

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Make io accessible to routes
app.set('io', io)

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id)

  // Join room based on user role
  socket.on('join-recruiter-room', (data) => {
    socket.join('recruiters')
    console.log('👔 Recruiter joined room:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id)
  })
})

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentai'

if (mongoUri.includes('xxxxx')) {
  console.error('❌ ERROR: MongoDB URI not configured properly!')
  console.error('Please update your .env file with your actual MongoDB Atlas connection string.')
  console.error('Current URI:', mongoUri)
  console.error('\nSteps to fix:')
  console.error('1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas')
  console.error('2. Click "Connect" on your cluster')
  console.error('3. Choose "Drivers" and copy the connection string')
  console.error('4. Replace xxxxx with your actual cluster URL')
  console.error('5. Replace the password with your database user password')
  process.exit(1)
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check your MongoDB URI in .env file')
    console.error('2. Verify username and password are correct')
    console.error('3. Check IP whitelist in MongoDB Atlas (Network Access)')
    console.error('4. Ensure your cluster is running')
  })

// Confirm AI keys loaded
console.log('🔑 GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY)
console.log('🔑 OPENAI_API_KEY loaded:', !!process.env.OPENAI_API_KEY)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/candidates', candidateRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/ai-interview', aiInterviewRoutes)
app.use('/api/interview-session', interviewSessionRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api', contactRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() })
})

// Debug: verify token and return decoded role — helps diagnose 401/403 issues
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key')
    res.json({ userId: decoded.userId, role: decoded.role, exp: new Date(decoded.exp * 1000) })
  } catch (e) {
    res.status(401).json({ error: 'Invalid token', detail: e.message })
  }
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`)
  console.log(`📍 API Health: http://localhost:${PORT}/api/health`)
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`)
  console.log(`🔌 Socket.io ready for real-time updates`)
})

export { io }
