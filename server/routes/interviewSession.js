import express from 'express'
import { authenticate } from '../middleware/auth.js'
import InterviewSession from '../models/InterviewSession.js'
import InterviewQuestion from '../models/InterviewQuestion.js'
import { generateInterviewQuestions, evaluateAnswer } from '../services/interviewService.js'

const router = express.Router()

/**
 * Start new interview session
 * POST /api/interview-session/start
 */
router.post('/start', authenticate, async (req, res) => {
  try {
    const { candidateId, jobRole, jobDescription, requiredSkills, candidateSkills, interviewToken } = req.body

    console.log('\n=== START INTERVIEW SESSION ===')
    console.log('Request body:', req.body)
    console.log('Auth user ID:', req.userId)

    if (!candidateId || !jobRole || !interviewToken) {
      console.error('Missing required fields:', { candidateId, jobRole, interviewToken })
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['candidateId', 'jobRole', 'interviewToken'],
        received: { candidateId: !!candidateId, jobRole: !!jobRole, interviewToken: !!interviewToken }
      })
    }

    console.log('Candidate:', candidateId)
    console.log('Job Role:', jobRole)
    console.log('Interview Token:', interviewToken)

    // Check if session already exists for this token
    let session = await InterviewSession.findOne({ interviewToken })
    
    if (session) {
      console.log('Interview session already exists:', session._id)
      console.log('Returning existing session')
    } else {
      // Create new interview session
      session = new InterviewSession({
        candidateId,
        jobRole,
        jobDescription: jobDescription || `Interview for ${jobRole}`,
        requiredSkills: requiredSkills || [],
        candidateSkills: candidateSkills || [],
        interviewToken,
        status: 'in_progress',
        startedAt: new Date()
      })

      await session.save()
      console.log('Interview session created:', session._id)
    }

    // Always generate new questions for each interview (don't reuse)
    console.log('Generating new interview questions...')
    let questions
    try {
      questions = await generateInterviewQuestions({
        jobRole,
        jobDescription: jobDescription || `Interview for ${jobRole}`,
        requiredSkills: requiredSkills || [],
        candidateSkills: candidateSkills || []
      })
      console.log(`Generated ${questions.length} new questions`)
    } catch (apiError) {
      console.error('Error generating questions:', apiError.message)
      console.error('Full error:', apiError)
      throw apiError
    }

    // Delete any existing questions for this session (in case of retry)
    await InterviewQuestion.deleteMany({ sessionId: session._id })
    console.log('Cleared any existing questions for this session')

    // Store new questions
    let storedQuestions = []
    for (let i = 0; i < questions.length; i++) {
      const question = new InterviewQuestion({
        sessionId: session._id,
        questionNumber: i + 1,
        questionText: questions[i].question,
        questionType: questions[i].type || 'short_answer',
        difficulty: questions[i].difficulty || 'medium'
      })
      await question.save()
      storedQuestions.push(question)
    }
    console.log(`Stored ${storedQuestions.length} new questions`)

    console.log('=== INTERVIEW SESSION STARTED ===\n')

    res.json({
      success: true,
      session: {
        sessionId: session._id,
        candidateId,
        jobRole,
        totalQuestions: storedQuestions.length,
        questions: storedQuestions.map(q => ({
          id: q._id,
          number: q.questionNumber,
          text: q.questionText,
          type: q.questionType
        }))
      }
    })
  } catch (error) {
    console.error('Error starting interview session:', error)
    res.status(500).json({ 
      error: 'Failed to start interview session',
      details: error.message
    })
  }
})

/**
 * Get interview session
 * GET /api/interview-session/:sessionId
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await InterviewSession.findById(sessionId)
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' })
    }

    const questions = await InterviewQuestion.find({ sessionId })

    res.json({
      success: true,
      session: {
        id: session._id,
        candidateId: session.candidateId,
        jobRole: session.jobRole,
        status: session.status,
        totalQuestions: questions.length,
        questions: questions.map(q => ({
          id: q._id,
          number: q.questionNumber,
          text: q.questionText,
          type: q.questionType,
          answered: !!q.candidateAnswer
        }))
      }
    })
  } catch (error) {
    console.error('Error getting interview session:', error)
    res.status(500).json({ error: 'Failed to get interview session' })
  }
})

/**
 * Submit answer
 * POST /api/interview-session/answer
 */
router.post('/answer', async (req, res) => {
  try {
    const { sessionId, questionId, answer } = req.body

    if (!sessionId || !questionId || !answer) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    console.log(`\nSubmitting answer for question ${questionId}`)

    const question = await InterviewQuestion.findById(questionId)
    if (!question) {
      return res.status(404).json({ error: 'Question not found' })
    }

    // Evaluate answer using Gemini API
    const evaluation = await evaluateAnswer({
      question: question.questionText,
      answer,
      questionType: question.questionType
    })

    // Store answer and evaluation
    question.candidateAnswer = answer
    question.score = evaluation.score
    question.feedback = evaluation.feedback
    question.answeredAt = new Date()
    await question.save()

    console.log(`Answer evaluated. Score: ${evaluation.score}`)

    res.json({
      success: true,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements
      }
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    res.status(500).json({ error: 'Failed to submit answer' })
  }
})

/**
 * Complete interview
 * POST /api/interview-session/:sessionId/complete
 */
router.post('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await InterviewSession.findById(sessionId)
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' })
    }

    const questions = await InterviewQuestion.find({ sessionId })

    // Calculate scores
    const answeredQuestions = questions.filter(q => q.candidateAnswer)
    const totalScore = answeredQuestions.length > 0
      ? Math.round(answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length)
      : 0

    // Update session
    session.status = 'completed'
    session.completedAt = new Date()
    session.finalScore = totalScore
    await session.save()

    console.log(`\nInterview completed. Final Score: ${totalScore}%`)

    // Call the main AI Interview update endpoint to record score
    try {
      const axios = (await import('axios')).default
      await axios.post('http://localhost:5555/api/ai-interview/update-score', {
        interviewToken: session.interviewToken,
        score: totalScore,
        totalQuestions: questions.length,
        correctAnswers: answeredQuestions.length,
        feedback: `Interview completed with ${answeredQuestions.length}/${questions.length} questions answered`
      })
      console.log('Score recorded in main system')
    } catch (error) {
      console.error('Error recording score:', error.message)
    }

    res.json({
      success: true,
      summary: {
        sessionId: session._id,
        totalQuestions: questions.length,
        answeredQuestions: answeredQuestions.length,
        finalScore: totalScore,
        questions: questions.map(q => ({
          number: q.questionNumber,
          text: q.questionText,
          answer: q.candidateAnswer,
          score: q.score,
          feedback: q.feedback
        }))
      }
    })
  } catch (error) {
    console.error('Error completing interview:', error)
    res.status(500).json({ error: 'Failed to complete interview' })
  }
})

export default router
