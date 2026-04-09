import AIInterview from '../models/AIInterview.js'
import Candidate from '../models/Candidate.js'
import crypto from 'crypto'

class AIInterviewService {
  /**
   * Generate unique interview token
   */
  generateInterviewToken() {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Create AI interview session
   */
  async createInterviewSession(candidateId, jobId, recruiterId, aiInterviewBaseUrl) {
    try {
      const interviewToken = this.generateInterviewToken()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      // Generate interview link
      const interviewLink = `${aiInterviewBaseUrl}/interview/${interviewToken}`

      const aiInterview = new AIInterview({
        candidateId,
        jobId,
        recruiterId,
        interviewLink,
        interviewToken,
        expiresAt
      })

      await aiInterview.save()

      console.log('AI Interview Session Created:', {
        interviewId: aiInterview._id,
        candidateId,
        jobId,
        token: interviewToken,
        link: interviewLink,
        expiresAt
      })

      return aiInterview
    } catch (error) {
      console.error('Error creating interview session:', error)
      throw error
    }
  }

  /**
   * Get interview by token
   */
  async getInterviewByToken(token) {
    try {
      const interview = await AIInterview.findOne({ interviewToken: token })
        .populate('candidateId', 'name email')
        .populate('jobId', 'title')
        .populate('recruiterId', 'name email')

      if (!interview) {
        return null
      }

      // Check if expired
      if (new Date() > interview.expiresAt) {
        await AIInterview.findByIdAndUpdate(interview._id, { status: 'expired' })
        return null
      }

      return interview
    } catch (error) {
      console.error('Error getting interview by token:', error)
      throw error
    }
  }

  /**
   * Update interview score
   */
  async updateInterviewScore(interviewToken, score, totalQuestions, correctAnswers, feedback) {
    try {
      const interview = await AIInterview.findOneAndUpdate(
        { interviewToken },
        {
          score,
          totalQuestions,
          correctAnswers,
          feedback,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        },
        { new: true }
      )
        .populate('candidateId')
        .populate('jobId')
        .populate('recruiterId')

      if (!interview) {
        throw new Error('Interview not found')
      }

      console.log('Interview Score Updated:', {
        interviewId: interview._id,
        candidateId: interview.candidateId._id,
        score,
        totalQuestions,
        correctAnswers
      })

      // Update candidate's interview score
      await Candidate.findOneAndUpdate(
        { userId: interview.candidateId._id, jobId: interview.jobId._id },
        { interviewScore: score },
        { new: true }
      )

      return interview
    } catch (error) {
      console.error('Error updating interview score:', error)
      throw error
    }
  }

  /**
   * Get all interviews for a job (for ranking)
   */
  async getInterviewsForJob(jobId) {
    try {
      const interviews = await AIInterview.find({ jobId, status: 'completed' })
        .populate('candidateId', 'name email')
        .sort({ score: -1 })

      return interviews.map((interview, index) => ({
        rank: index + 1,
        candidateName: interview.candidateId.name,
        candidateEmail: interview.candidateId.email,
        score: interview.score,
        totalQuestions: interview.totalQuestions,
        correctAnswers: interview.correctAnswers,
        completedAt: interview.completedAt
      }))
    } catch (error) {
      console.error('Error getting interviews for job:', error)
      throw error
    }
  }

  /**
   * Get all interviews for a candidate
   */
  async getInterviewsForCandidate(candidateId) {
    try {
      const interviews = await AIInterview.find({ candidateId })
        .populate('jobId', 'title')
        .populate('recruiterId', 'name')
        .sort({ createdAt: -1 })

      return interviews
    } catch (error) {
      console.error('Error getting interviews for candidate:', error)
      throw error
    }
  }

  /**
   * Mark email as sent
   */
  async markEmailSent(interviewId) {
    try {
      await AIInterview.findByIdAndUpdate(
        interviewId,
        { emailSent: true },
        { new: true }
      )
    } catch (error) {
      console.error('Error marking email as sent:', error)
    }
  }

  /**
   * Mark dashboard notification as sent
   */
  async markDashboardNotified(interviewId) {
    try {
      await AIInterview.findByIdAndUpdate(
        interviewId,
        { dashboardNotified: true },
        { new: true }
      )
    } catch (error) {
      console.error('Error marking dashboard notification:', error)
    }
  }

  /**
   * Get pending interviews (not yet started)
   */
  async getPendingInterviews(candidateId) {
    try {
      const interviews = await AIInterview.find({
        candidateId,
        status: 'pending'
      })
        .populate('jobId', 'title')
        .populate('recruiterId', 'name')

      return interviews
    } catch (error) {
      console.error('Error getting pending interviews:', error)
      throw error
    }
  }

  /**
   * Get completed interviews (with scores)
   */
  async getCompletedInterviews(candidateId) {
    try {
      const interviews = await AIInterview.find({
        candidateId,
        status: 'completed'
      })
        .populate('jobId', 'title')
        .populate('recruiterId', 'name')
        .sort({ completedAt: -1 })

      return interviews
    } catch (error) {
      console.error('Error getting completed interviews:', error)
      throw error
    }
  }
}

export default new AIInterviewService()
