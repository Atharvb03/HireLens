import express from 'express'
import Candidate from '../models/Candidate.js'
import User from '../models/User.js'
import JobPosting from '../models/JobPosting.js'
import CandidateProfile from '../models/CandidateProfile.js'
import { authenticate } from '../middleware/auth.js'
import matchingService from '../services/matchingService.js'
import { autoUpdateOnApplication } from '../services/statusService.js'
import multer from 'multer'
import { extractTextFromFile } from '../utils/fileParser.js'

const router = express.Router()

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() })

router.post('/apply', authenticate, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, availability, noticePeriod } = req.body
    
    console.log('Apply Request:', { jobId, availability, fileName: req.file?.originalname })
    
    if (!availability) {
      return res.status(400).json({ error: 'Availability is required' })
    }

    if (availability === 'notice_period' && !noticePeriod) {
      return res.status(400).json({ error: 'Notice period is required' })
    }

    // File is optional — profile can be used as fallback

    const existingApplication = await Candidate.findOne({
      userId: req.userId,
      jobId
    })
    
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' })
    }

    // Get job details
    const job = await JobPosting.findById(jobId)
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Extract text — from uploaded file OR saved profile
    let resumeText = ''
    let resumeUrl = ''

    if (req.file) {
      resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype)
      resumeUrl = `resume_${Date.now()}_${req.file.originalname}`
      console.log('Resume extracted from file:', { length: resumeText?.length })
    } else {
      // Fall back to saved profile
      const profile = await CandidateProfile.findOne({ userId: req.userId })
      if (!profile || !profile.generatedResumeText) {
        return res.status(400).json({ error: 'Please upload a resume or complete your profile first' })
      }
      resumeText = profile.generatedResumeText
      resumeUrl = 'profile_generated'
      console.log('Resume text from saved profile:', { length: resumeText?.length })
    }

    // Calculate match score using AI-powered matching service
    const matchResult = await matchingService.matchResumeToJob(
      resumeText || '',
      job.description || '',
      job.requiredSkills || [],
      job   // pass full job object for AI evaluation
    )

    console.log('Match result — source:', matchResult.source, '| score:', matchResult.matchScore)

    const candidate = new Candidate({
      userId: req.userId,
      jobId,
      resumeUrl,
      resumeText,
      availability,
      noticePeriod: availability === 'notice_period' ? noticePeriod : null,
      matchScore: matchResult.matchScore,
      skillMatchScore: matchResult.skillMatchScore,
      experienceMatch: matchResult.experienceMatch,
      educationMatch: matchResult.educationMatch,
      projectRelevance: matchResult.projectRelevance,
      extractedSkills: matchResult.extractedSkills,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      overallAssessment: matchResult.overallAssessment,
      strengths: matchResult.strengths,
      concerns: matchResult.concerns,
      matchSource: matchResult.source,
      parsedResume: matchResult.parsedResume || undefined,
      status: 'applied'
    })
    
    await candidate.save()

    // Auto status: applied → screening if matchScore >= 70
    await autoUpdateOnApplication(candidate._id, matchResult.matchScore)

    // Rank candidates for this job
    await matchingService.rankCandidatesForJob(jobId)

    res.status(201).json(candidate)
  } catch (error) {
    console.error('Error in apply:', error)
    res.status(500).json({ error: 'Failed to apply for job' })
  }
})

router.get('/applications/:userId', authenticate, async (req, res) => {
  try {
    const applications = await Candidate.find({ userId: req.params.userId })
      .populate('jobId')
      .populate('resumeId')
    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

router.get('/profile/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

router.get('/applications', authenticate, async (req, res) => {
  try {
    const applications = await Candidate.find()
      .populate('userId')
      .populate('jobId')
      .populate('resumeId')
      .sort({ matchScore: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

router.get('/job/:jobId/ranked', authenticate, async (req, res) => {
  try {
    const rankedCandidates = await matchingService.getRankedCandidates(req.params.jobId)
    res.json(rankedCandidates)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ranked candidates' })
  }
})

router.put('/:candidateId', authenticate, async (req, res) => {
  try {
    const { interviewScore, feedback, status } = req.body
    
    // Get current candidate to check if they have an interview score
    const currentCandidate = await Candidate.findById(req.params.candidateId)
    if (!currentCandidate) {
      return res.status(404).json({ error: 'Candidate not found' })
    }

    // Prevent recruiter from overriding auto-determined status based on interview score
    if (currentCandidate.interviewScore != null && status && status !== currentCandidate.status) {
      return res.status(403).json({ 
        error: 'Cannot override status for candidates with completed interviews. Status is automatically determined by interview score.',
        currentStatus: currentCandidate.status,
        interviewScore: currentCandidate.interviewScore
      })
    }

    const updateData = { feedback }
    
    // Only allow status update if no interview score exists
    if (status && currentCandidate.interviewScore == null) {
      updateData.status = status
      updateData.statusUpdatedAt = new Date()
      updateData.statusNote = 'Manually updated by recruiter'
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.candidateId,
      updateData,
      { new: true }
    ).populate('userId').populate('jobId')
    
    res.json(candidate)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate' })
  }
})

router.delete('/:candidateId', authenticate, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId)
    
    if (!candidate) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Check if user is the applicant or an admin
    if (candidate.userId.toString() !== req.userId && req.role !== 'recruiter') {
      return res.status(403).json({ error: 'Unauthorized to delete this application' })
    }

    await Candidate.findByIdAndDelete(req.params.candidateId)
    res.json({ message: 'Application deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' })
  }
})

export default router
