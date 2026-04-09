import express from 'express'
import { authenticate } from '../middleware/auth.js'
import aiInterviewService from '../services/aiInterviewService.js'
import AIInterview from '../models/AIInterview.js'
import Candidate from '../models/Candidate.js'
import JobPosting from '../models/JobPosting.js'
import nodemailer from 'nodemailer'

const router = express.Router()

// Configure email (update with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
})

/**
 * Send AI interview link to candidate
 * POST /api/ai-interview/send-link
 */
router.post('/send-link', authenticate, async (req, res) => {
  try {
    const { candidateId, jobId } = req.body
    const recruiterId = req.userId

    if (!candidateId || !jobId) {
      return res.status(400).json({ error: 'Candidate ID and Job ID required' })
    }

    console.log('\n=== SEND AI INTERVIEW LINK ===')
    console.log('Recruiter:', recruiterId)
    console.log('Candidate:', candidateId)
    console.log('Job:', jobId)

    // Create interview session
    const aiInterviewBaseUrl = process.env.AI_INTERVIEW_BASE_URL || 'http://localhost:3001'
    const interview = await aiInterviewService.createInterviewSession(
      candidateId,
      jobId,
      recruiterId,
      aiInterviewBaseUrl
    )

    // Get candidate and job details
    const candidate = await Candidate.findOne({ userId: candidateId }).populate('userId')
    const job = await JobPosting.findById(jobId)

    if (!candidate || !job) {
      return res.status(404).json({ error: 'Candidate or Job not found' })
    }

    // Email sending is now optional - recruiter will share link manually
    // If you want to enable email, uncomment the code below and configure EMAIL_USER and EMAIL_PASSWORD

    console.log('=== INTERVIEW LINK SENT ===\n')

    res.json({
      success: true,
      message: 'Interview link generated successfully',
      interview: {
        interviewId: interview._id,
        candidateName: candidate.userId.name,
        candidateEmail: candidate.userId.email,
        jobTitle: job.title,
        interviewLink: interview.interviewLink,
        expiresAt: interview.expiresAt
      }
    })
  } catch (error) {
    console.error('Error sending interview link:', error)
    res.status(500).json({ error: 'Failed to send interview link' })
  }
})

/**
 * Get interview by token (for candidate to access)
 * GET /api/ai-interview/:token
 */
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params

    const interview = await aiInterviewService.getInterviewByToken(token)

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found or expired' })
    }

    // Populate job details for domain-specific questions
    const job = await JobPosting.findById(interview.jobId)

    res.json({
      success: true,
      interview: {
        interviewId: interview._id,
        candidateName: interview.candidateId.name,
        jobTitle: interview.jobTitle,
        jobDescription: job?.description || '',
        requiredSkills: job?.requiredSkills || [],
        status: interview.status,
        score: interview.score,
        interviewLink: interview.interviewLink
      }
    })
  } catch (error) {
    console.error('Error getting interview:', error)
    res.status(500).json({ error: 'Failed to get interview' })
  }
})

/**
 * Update interview score (called by AI Interview system)
 * POST /api/ai-interview/update-score
 */
router.post('/update-score', async (req, res) => {
  try {
    const { interviewToken, score, totalQuestions, correctAnswers, feedback } = req.body

    if (!interviewToken || score === undefined) {
      return res.status(400).json({ error: 'Interview token and score required' })
    }

    console.log('\n=== UPDATE INTERVIEW SCORE ===')
    console.log('Token:', interviewToken)
    console.log('Score:', score)
    console.log('Total Questions:', totalQuestions)
    console.log('Correct Answers:', correctAnswers)

    const interview = await aiInterviewService.updateInterviewScore(
      interviewToken,
      score,
      totalQuestions,
      correctAnswers,
      feedback
    )

    console.log('=== SCORE UPDATED ===\n')

    res.json({
      success: true,
      message: 'Interview score updated',
      interview: {
        interviewId: interview._id,
        candidateId: interview.candidateId._id,
        score: interview.score,
        status: interview.status
      }
    })
  } catch (error) {
    console.error('Error updating interview score:', error)
    res.status(500).json({ error: 'Failed to update interview score' })
  }
})

/**
 * Get all interviews for a job (for recruiter ranking)
 * GET /api/ai-interview/job/:jobId
 */
router.get('/job/:jobId', authenticate, async (req, res) => {
  try {
    const { jobId } = req.params

    const interviews = await aiInterviewService.getInterviewsForJob(jobId)

    res.json({
      success: true,
      interviews,
      totalCandidates: interviews.length
    })
  } catch (error) {
    console.error('Error getting job interviews:', error)
    res.status(500).json({ error: 'Failed to get interviews' })
  }
})

/**
 * Get all interviews for a candidate
 * GET /api/ai-interview/candidate/all
 */
router.get('/candidate/all', authenticate, async (req, res) => {
  try {
    const candidateId = req.userId

    const pendingInterviews = await aiInterviewService.getPendingInterviews(candidateId)
    const completedInterviews = await aiInterviewService.getCompletedInterviews(candidateId)

    res.json({
      success: true,
      pending: pendingInterviews,
      completed: completedInterviews
    })
  } catch (error) {
    console.error('Error getting candidate interviews:', error)
    res.status(500).json({ error: 'Failed to get interviews' })
  }
})

/**
 * Get pending interviews for candidate
 * GET /api/ai-interview/candidate/pending
 */
router.get('/candidate/pending', authenticate, async (req, res) => {
  try {
    const candidateId = req.userId

    const interviews = await aiInterviewService.getPendingInterviews(candidateId)

    res.json({
      success: true,
      interviews
    })
  } catch (error) {
    console.error('Error getting pending interviews:', error)
    res.status(500).json({ error: 'Failed to get interviews' })
  }
})

/**
 * Get completed interviews for candidate
 * GET /api/ai-interview/candidate/completed
 */
router.get('/candidate/completed', authenticate, async (req, res) => {
  try {
    const candidateId = req.userId

    const interviews = await aiInterviewService.getCompletedInterviews(candidateId)

    res.json({
      success: true,
      interviews
    })
  } catch (error) {
    console.error('Error getting completed interviews:', error)
    res.status(500).json({ error: 'Failed to get interviews' })
  }
})

export default router
