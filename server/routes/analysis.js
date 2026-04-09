import express from 'express'
import JobPosting from '../models/JobPosting.js'
import { authenticate } from '../middleware/auth.js'
import matchingService from '../services/matchingService.js'
import jobSearchService from '../services/jobSearchService.js'
import multer from 'multer'
import { extractTextFromFile } from '../utils/fileParser.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Analyze resume against a specific job
router.post('/analyze-resume-for-job', authenticate, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.body

    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' })
    }

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' })
    }

    // Get job details
    const job = await JobPosting.findById(jobId)
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    console.log('\n=== ANALYSIS REQUEST ===')
    console.log('Job Title:', job.title)
    console.log('Job Required Skills:', job.requiredSkills)
    console.log('File Name:', req.file.originalname)
    console.log('File MIME Type:', req.file.mimetype)

    // Extract text from resume file
    const resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype)
    console.log('Extracted Resume Text Length:', resumeText?.length || 0)
    console.log('Resume Text Preview:', resumeText?.substring(0, 200))

    // Calculate match score
    const matchResult = await matchingService.matchResumeToJob(
      resumeText || '',
      job.description || '',
      job.requiredSkills || []
    )

    // Extract skills from resume
    const resumeSkillFreq = matchingService.extractSkillsWithFrequency(resumeText)
    const resumeSkills = Object.keys(resumeSkillFreq)

    // Calculate skill gaps
    const normalizedJobSkills = job.requiredSkills.map(s => 
      matchingService.normalizeSkill(s)
    )
    const jobSkillsSet = new Set(normalizedJobSkills)
    const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase()))
    
    const missingSkills = [...jobSkillsSet].filter(skill => !resumeSkillsSet.has(skill))
    const matchedSkills = [...resumeSkillsSet].filter(skill => jobSkillsSet.has(skill))

    console.log('Matched Skills:', matchedSkills)
    console.log('Missing Skills:', missingSkills)
    console.log('=== ANALYSIS END ===\n')

    // Generate skill gap suggestions
    const skillGapSuggestions = missingSkills.map(skill => ({
      skill,
      suggestion: `Learn ${skill} to improve your match for this role`,
      resources: `Search for "${skill} tutorials" or online courses`
    }))

    res.json({
      matchScore: matchResult.matchScore,
      skillMatchScore: matchResult.skillMatchScore,
      extractedSkills: resumeSkills,
      matchedSkills,
      missingSkills,
      skillGapSuggestions,
      canApply: matchResult.matchScore >= 60,
      jobTitle: job.title,
      jobDescription: job.description
    })
  } catch (error) {
    console.error('Error in analyze-resume-for-job:', error)
    res.status(500).json({ error: 'Failed to analyze resume' })
  }
})

// Find best matching jobs for a resume (from internet only)
router.post('/find-best-jobs', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' })
    }

    console.log('\n=== FIND BEST JOBS REQUEST ===')

    // Extract text from resume file
    const resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype)
    console.log('Resume Text Length:', resumeText?.length || 0)

    // Extract skills from resume
    const resumeSkillFreq = matchingService.extractSkillsWithFrequency(resumeText)
    const resumeSkills = Object.keys(resumeSkillFreq)
    console.log('Resume Skills:', resumeSkills)

    // Get jobs from internet only
    console.log('Searching internet for jobs...')
    const internetJobs = await jobSearchService.searchJobs(resumeSkills, 'remote', 15)
    console.log('Internet Jobs Found:', internetJobs.length)

    // Calculate match scores for internet jobs
    const internetJobMatches = internetJobs.map(job => {
      const matchResult = matchingService.matchResumeToJob(
        resumeText || '',
        job.jobDescription || '',
        job.requiredSkills || []
      )

      return {
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        requiredSkills: job.requiredSkills,
        matchScore: matchResult.matchScore || 0,
        skillMatchScore: matchResult.skillMatchScore || 0,
        status: job.jobType,
        location: job.location,
        salary: job.salary,
        company: job.company,
        jobUrl: job.jobUrl,
        source: job.source,
        isExternal: true
      }
    })

    // Sort by match score
    const topJobs = internetJobMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15)  // Return top 15 internet jobs

    console.log('Top Jobs Returned:', topJobs.length)
    console.log('Top Job Scores:', topJobs.map(j => ({ 
      title: j.jobTitle, 
      score: j.matchScore,
      source: j.source 
    })))
    console.log('=== FIND BEST JOBS END ===\n')

    res.json({
      topJobs,
      totalJobsAnalyzed: internetJobMatches.length,
      resumeSkills
    })
  } catch (error) {
    console.error('Error in find-best-jobs:', error)
    res.status(500).json({ error: 'Failed to find matching jobs' })
  }
})

export default router
