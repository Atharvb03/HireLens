import express from 'express'
import JobPosting from '../models/JobPosting.js'
import { authenticate } from '../middleware/auth.js'
import matchingService from '../services/matchingService.js'
import jobSearchService from '../services/jobSearchService.js'
import multer from 'multer'
import { extractTextFromFile } from '../utils/fileParser.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Analyze resume against a specific job — now AI-powered
router.post('/analyze-resume-for-job', authenticate, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.body

    if (!req.file) return res.status(400).json({ error: 'Resume file is required' })
    if (!jobId) return res.status(400).json({ error: 'Job ID is required' })

    const job = await JobPosting.findById(jobId)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    console.log('\n=== ANALYSIS REQUEST ===')
    console.log('Job:', job.title, '| File:', req.file.originalname)

    const resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype)
    console.log('Resume text length:', resumeText?.length || 0)

    // Pass the full job object so AI match evaluation can use title + description
    const matchResult = await matchingService.matchResumeToJob(
      resumeText || '',
      job.description || '',
      job.requiredSkills || [],
      job   // <-- full job object for AI evaluation
    )

    console.log('Match source:', matchResult.source, '| Score:', matchResult.matchScore)
    console.log('=== ANALYSIS END ===\n')

    res.json({
      // Core scores
      matchScore: matchResult.matchScore,
      skillMatchScore: matchResult.skillMatchScore,
      experienceMatch: matchResult.experienceMatch,
      educationMatch: matchResult.educationMatch,
      projectRelevance: matchResult.projectRelevance,

      // Skills breakdown
      extractedSkills: matchResult.extractedSkills,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      skillGapSuggestions: matchResult.skillGapSuggestions,

      // AI narrative fields
      overallAssessment: matchResult.overallAssessment,
      strengths: matchResult.strengths,
      concerns: matchResult.concerns,

      // Structured resume data (only when AI parsed)
      parsedResume: matchResult.parsedResume,

      // Meta
      source: matchResult.source,
      canApply: matchResult.matchScore >= 60,
      jobTitle: job.title,
      jobDescription: job.description
    })
  } catch (error) {
    console.error('Error in analyze-resume-for-job:', error)
    res.status(500).json({ error: 'Failed to analyze resume' })
  }
})

// Find best matching jobs for a resume
router.post('/find-best-jobs', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Resume file is required' })

    const resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype)

    // Use AI-extracted skills if available, else regex
    const matchResult = await matchingService.matchResumeToJob(resumeText || '', '', [])
    const resumeSkills = matchResult.extractedSkills || []

    console.log('Resume skills for job search:', resumeSkills.length)

    const internetJobs = await jobSearchService.searchJobs(resumeSkills, 'remote', 15)

    const jobMatches = await Promise.all(
      internetJobs.map(async (job) => {
        const r = await matchingService.matchResumeToJob(
          resumeText || '',
          job.jobDescription || '',
          job.requiredSkills || []
          // no jobObject here — keep it fast with regex for bulk search
        )
        return {
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          requiredSkills: job.requiredSkills,
          matchScore: r.matchScore || 0,
          skillMatchScore: r.skillMatchScore || 0,
          status: job.jobType,
          location: job.location,
          salary: job.salary,
          company: job.company,
          jobUrl: job.jobUrl,
          source: job.source,
          isExternal: true
        }
      })
    )

    const topJobs = jobMatches.sort((a,b) => b.matchScore - a.matchScore).slice(0, 15)

    res.json({ topJobs, totalJobsAnalyzed: jobMatches.length, resumeSkills })
  } catch (error) {
    console.error('Error in find-best-jobs:', error)
    res.status(500).json({ error: 'Failed to find matching jobs' })
  }
})

export default router
