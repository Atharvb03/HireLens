import express from 'express'
import { OpenAI } from 'openai'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Initialize OpenAI only if API key exists
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

router.post('/analyze-resume', authenticate, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'AI service not configured. Please set OPENAI_API_KEY in .env' })
    }

    const { resumeText } = req.body

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter. Analyze the resume and extract skills, experience, and education in JSON format.'
        },
        {
          role: 'user',
          content: `Analyze this resume and return JSON with keys: skills (array), experience (array), education (array), summary (string)\n\n${resumeText}`
        }
      ]
    })

    const analysisText = response.choices[0].message.content
    const analysis = JSON.parse(analysisText)
    
    res.json(analysis)
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze resume' })
  }
})

router.post('/match-candidate', authenticate, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'AI service not configured. Please set OPENAI_API_KEY in .env' })
    }

    const { candidateSkills, jobRequirements } = req.body

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter. Calculate match score between candidate and job.'
        },
        {
          role: 'user',
          content: `Candidate skills: ${candidateSkills.join(', ')}\nJob requirements: ${jobRequirements.join(', ')}\n\nReturn a JSON with: matchScore (0-100), matchedSkills (array), missingSkills (array), recommendation (string)`
        }
      ]
    })

    const matchText = response.choices[0].message.content
    const matchResult = JSON.parse(matchText)
    
    res.json(matchResult)
  } catch (error) {
    res.status(500).json({ error: 'Failed to match candidate' })
  }
})

router.post('/generate-interview-questions', authenticate, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'AI service not configured. Please set OPENAI_API_KEY in .env' })
    }

    const { jobTitle, skills } = req.body

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer. Generate relevant interview questions.'
        },
        {
          role: 'user',
          content: `Generate 5 interview questions for a ${jobTitle} position requiring skills: ${skills.join(', ')}. Return as JSON array with questions.`
        }
      ]
    })

    const questionsText = response.choices[0].message.content
    const questions = JSON.parse(questionsText)
    
    res.json({ questions })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' })
  }
})

export default router
