import express from 'express'
import { authenticate } from '../middleware/auth.js'
import CandidateProfile from '../models/CandidateProfile.js'
import matchingService from '../services/matchingService.js'
import jobSearchService from '../services/jobSearchService.js'
import JobPosting from '../models/JobPosting.js'

const router = express.Router()

// Build resume text from profile fields — same logic as the model pre-save hook
// Called here so we always have fresh text even if DB cache is stale
function buildResumeText(p) {
  const lines = []
  if (p.headline) lines.push(p.headline)
  if (p.summary) lines.push('\nSUMMARY\n' + p.summary)
  if (p.skills?.length) lines.push('\nSKILLS\n' + p.skills.join(', '))
  if (p.experience?.length) {
    lines.push('\nEXPERIENCE')
    for (const e of p.experience) {
      lines.push(`${e.title} at ${e.company} (${e.startDate || ''} - ${e.current ? 'Present' : e.endDate || ''})`)
      if (e.description) lines.push(e.description)
    }
  }
  if (p.education?.length) {
    lines.push('\nEDUCATION')
    for (const e of p.education) {
      lines.push(`${e.degree}${e.field ? ' in ' + e.field : ''} — ${e.institution} (${e.startYear || ''} - ${e.endYear || ''})`)
      if (e.gpa) lines.push(`GPA: ${e.gpa}`)
    }
  }
  if (p.certifications?.length) lines.push('\nCERTIFICATIONS\n' + p.certifications.join(', '))
  if (p.portfolioLinks?.length) {
    lines.push('\nLINKS')
    for (const l of p.portfolioLinks) lines.push(`${l.label}: ${l.url}`)
  }
  return lines.join('\n')
}

// GET /api/profile — get current user's profile
router.get('/', authenticate, async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ userId: req.userId })
    if (!profile) {
      // Return empty profile shape so frontend can populate form
      profile = { userId: req.userId, skills: [], experience: [], education: [], portfolioLinks: [], certifications: [] }
    }
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// PUT /api/profile — create or update profile
router.put('/', authenticate, async (req, res) => {
  try {
    const data = req.body

    // findOneAndUpdate does NOT trigger pre('save') hooks.
    // Use findOne + assign + save so the pre-save hook runs and
    // generatedResumeText gets rebuilt from the new data.
    let profile = await CandidateProfile.findOne({ userId: req.userId })

    if (profile) {
      // Merge incoming fields onto the existing document
      Object.assign(profile, { ...data, userId: req.userId })
    } else {
      profile = new CandidateProfile({ ...data, userId: req.userId })
    }

    await profile.save()   // ← triggers pre('save') → rebuilds generatedResumeText
    res.json(profile)
  } catch (err) {
    console.error('Profile save error:', err)
    res.status(500).json({ error: 'Failed to save profile' })
  }
})

// POST /api/profile/match-job/:jobId — match profile against a specific job (no file upload)
router.post('/match-job/:jobId', authenticate, async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.userId })
    if (!profile || !profile.skills?.length) {
      return res.status(400).json({ error: 'Please add skills to your profile first' })
    }

    // Always rebuild fresh — don't rely on cached DB value
    const resumeText = buildResumeText(profile)

    console.log('\n=== PROFILE MATCH ===')
    console.log('Skills:', profile.skills)
    console.log('Resume text length:', resumeText.length)
    console.log('Resume text preview:', resumeText.substring(0, 300))

    const job = await JobPosting.findById(req.params.jobId)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const matchResult = await matchingService.matchResumeToJob(
      resumeText,   // ← use the freshly built text, not profile.generatedResumeText
      job.description || '',
      job.requiredSkills || [],
      job
    )

    console.log('Match score:', matchResult.matchScore, '| source:', matchResult.source)
    console.log('=== PROFILE MATCH END ===\n')

    res.json({
      matchScore: matchResult.matchScore,
      skillMatchScore: matchResult.skillMatchScore,
      experienceMatch: matchResult.experienceMatch,
      educationMatch: matchResult.educationMatch,
      projectRelevance: matchResult.projectRelevance,
      extractedSkills: matchResult.extractedSkills,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      skillGapSuggestions: matchResult.skillGapSuggestions,
      overallAssessment: matchResult.overallAssessment,
      strengths: matchResult.strengths,
      concerns: matchResult.concerns,
      source: matchResult.source,
      canApply: matchResult.matchScore >= 60,
      jobTitle: job.title,
    })
  } catch (err) {
    console.error('Profile match error:', err)
    res.status(500).json({ error: 'Failed to match profile' })
  }
})

// POST /api/profile/recommend-jobs — find best matching jobs from profile (no file upload)
router.post('/recommend-jobs', authenticate, async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.userId })
    if (!profile || !profile.skills?.length) {
      return res.status(400).json({ error: 'Please add skills to your profile first' })
    }

    const resumeText = buildResumeText(profile)

    // Search external jobs using profile skills
    const internetJobs = await jobSearchService.searchJobs(profile.skills, 'remote', 15)

    const jobMatches = await Promise.all(
      internetJobs.map(async (job) => {
        const r = await matchingService.matchResumeToJob(
          resumeText,
          job.jobDescription || '',
          job.requiredSkills || []
        )
        return {
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          requiredSkills: job.requiredSkills,
          matchScore: r.matchScore || 0,
          location: job.location,
          salary: job.salary,
          company: job.company,
          jobUrl: job.jobUrl,
          source: job.source,
          isExternal: true,
        }
      })
    )

    const topJobs = jobMatches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 15)

    res.json({ topJobs, resumeSkills: profile.skills, totalAnalyzed: jobMatches.length })
  } catch (err) {
    console.error('Recommend jobs error:', err)
    res.status(500).json({ error: 'Failed to find recommended jobs' })
  }
})

export default router
