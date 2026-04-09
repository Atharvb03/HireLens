import express from 'express'
import JobPosting from '../models/JobPosting.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticate, authorize(['recruiter', 'admin']), async (req, res) => {
  try {
    const { title, description, requiredSkills, experience, salary, location } = req.body
    const job = new JobPosting({
      recruiterId: req.userId,
      title,
      description,
      requiredSkills,
      experience,
      salary,
      location
    })
    await job.save()
    res.status(201).json(job)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job posting' })
  }
})

router.get('/', async (req, res) => {
  try {
    const jobs = await JobPosting.find({ status: 'open' })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiterId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this job' })
    }

    await JobPosting.findByIdAndDelete(req.params.id)
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' })
  }
})

export default router
