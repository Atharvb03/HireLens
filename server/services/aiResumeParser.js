import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Gemini model preference order
const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
]

let _genAI = null
let _openai = null

function getGenAI() {
  if (_genAI) return _genAI
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  _genAI = new GoogleGenerativeAI(key)
  console.log('✅ Gemini client initialized (key:', key.substring(0, 8) + '...)')
  return _genAI
}

function getOpenAI() {
  if (_openai) return _openai
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  _openai = new OpenAI({ apiKey: key })
  console.log('✅ OpenAI client initialized (key:', key.substring(0, 8) + '...)')
  return _openai
}

/**
 * Try Gemini models first, then fall back to OpenAI gpt-4o-mini.
 * Returns the response text string, or null if everything fails.
 */
async function generateWithFallback(prompt) {
  // ── Try Gemini ────────────────────────────────────────────────────────────
  const genAI = getGenAI()
  if (genAI) {
    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`🔄 Trying Gemini model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        console.log(`✅ Success with Gemini: ${modelName}`)
        return result.response.text().trim()
      } catch (err) {
        const skip =
          err.message?.includes('429') ||
          err.message?.includes('quota') ||
          err.message?.includes('Too Many Requests') ||
          err.message?.includes('404') ||
          err.message?.includes('not found')
        if (skip) {
          console.warn(`⚠️  ${modelName} skipped: ${err.message?.split('\n')[0]}`)
          continue
        }
        throw err
      }
    }
    console.warn('⚠️  All Gemini models exhausted — trying OpenAI fallback')
  }

  // ── Fall back to OpenAI ───────────────────────────────────────────────────
  const openai = getOpenAI()
  if (openai) {
    try {
      console.log('🔄 Trying OpenAI gpt-4o-mini fallback...')
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      })
      const text = response.choices[0].message.content?.trim()
      console.log('✅ Success with OpenAI gpt-4o-mini')
      return text
    } catch (err) {
      console.error('❌ OpenAI fallback failed:', err.message)
    }
  }

  console.error('❌ All AI providers exhausted — using regex fallback')
  return null
}

/**
 * Uses Gemini to semantically parse a resume into structured data.
 */
export async function parseResumeWithAI(resumeText) {
  if (!getGenAI()) {
    console.warn('⚠️  Gemini not available — falling back to regex parser')
    return null
  }

  const prompt = `You are an expert resume parser. Extract ALL information from the resume below and return it as a single valid JSON object.

RESUME TEXT:
"""
${resumeText}
"""

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "name": "Full name or empty string",
  "email": "email or empty string",
  "phone": "phone or empty string",
  "summary": "professional summary or objective, 1-3 sentences",
  "totalYearsExperience": 0,
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "duration": "Jan 2022 - Present",
      "years": 1.5,
      "description": "Key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science in Computer Science",
      "year": "2020",
      "gpa": "3.8 or empty string"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does and tech used",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "certifications": ["AWS Certified Developer", "Google Cloud Professional"]
}

Rules:
- skills: extract EVERY technical skill, tool, language, framework, library, platform mentioned anywhere in the resume
- totalYearsExperience: sum of all work experience years (estimate if ranges given)
- years in experience: decimal number (e.g. 1.5 for 18 months)
- If a field has no data, use empty string "" or empty array []
- Return ONLY the JSON, nothing else`

  try {
    const text = await generateWithFallback(prompt)
    if (!text) return null

    const cleaned = text
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

    const parsed = JSON.parse(cleaned)
    console.log('✅ AI resume parsed:', {
      name: parsed.name,
      skillCount: parsed.skills?.length,
      experienceCount: parsed.experience?.length,
      totalYears: parsed.totalYearsExperience
    })
    return parsed
  } catch (err) {
    console.error('❌ AI resume parse failed:', err.message)
    return null
  }
}

/**
 * Uses Gemini to semantically match a parsed resume against a job.
 */
export async function matchResumeToJobWithAI(parsedResume, job) {
  if (!getGenAI()) return null

  const prompt = `You are an expert technical recruiter. Evaluate how well this candidate matches the job.

JOB DETAILS:
Title: ${job.title}
Description: ${job.description}
Required Skills: ${(job.requiredSkills || []).join(', ')}
Experience Required: ${job.experience || 'Not specified'}

CANDIDATE PROFILE:
Name: ${parsedResume.name}
Total Experience: ${parsedResume.totalYearsExperience} years
Skills: ${(parsedResume.skills || []).join(', ')}
Experience: ${JSON.stringify(parsedResume.experience || [])}
Education: ${JSON.stringify(parsedResume.education || [])}
Projects: ${JSON.stringify(parsedResume.projects || [])}
Certifications: ${(parsedResume.certifications || []).join(', ')}

Evaluate and return ONLY a JSON object (no markdown):
{
  "matchScore": 75,
  "skillMatchScore": 80,
  "experienceMatch": 70,
  "educationMatch": 65,
  "projectRelevance": 60,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "skillGapSuggestions": [
    {
      "skill": "skill3",
      "suggestion": "Why this skill matters for the role",
      "resources": "Recommended learning path or resource"
    }
  ],
  "overallAssessment": "2-3 sentence honest assessment of the candidate's fit",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"]
}

Scoring rules:
- matchScore: overall fit (0-100), weighted average of all dimensions
- skillMatchScore: % of required skills the candidate has (0-100)
- experienceMatch: how well years + domain experience matches (0-100)
- educationMatch: relevance of education background (0-100)
- projectRelevance: how relevant their projects are to this role (0-100)
- matchedSkills: skills from requiredSkills that candidate clearly has
- missingSkills: skills from requiredSkills that candidate lacks
- Be honest and strict — do NOT inflate scores
- Return ONLY the JSON, nothing else`

  try {
    const text = await generateWithFallback(prompt)
    if (!text) return null

    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const evaluation = JSON.parse(cleaned)

    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v || 0)))
    evaluation.matchScore      = clamp(evaluation.matchScore)
    evaluation.skillMatchScore = clamp(evaluation.skillMatchScore)
    evaluation.experienceMatch = clamp(evaluation.experienceMatch)
    evaluation.educationMatch  = clamp(evaluation.educationMatch)
    evaluation.projectRelevance = clamp(evaluation.projectRelevance)

    console.log('✅ AI match evaluation:', {
      matchScore: evaluation.matchScore,
      skillMatchScore: evaluation.skillMatchScore,
      matchedSkills: evaluation.matchedSkills?.length,
      missingSkills: evaluation.missingSkills?.length
    })
    return evaluation
  } catch (err) {
    console.error('❌ AI match evaluation failed:', err.message)
    return null
  }
}
