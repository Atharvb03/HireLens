import Candidate from '../models/Candidate.js'
import User from '../models/User.js'
import JobPosting from '../models/JobPosting.js'
import {
  sendApplicationReceived,
  sendInterviewInvite,
  sendStatusUpdate
} from './emailService.js'

export const THRESHOLDS = {
  SCREENING: 70,  // matchScore to move applied → screening
  HIRED: 70,      // interviewScore >= 70 → hired, < 70 → rejected (no dead zone)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getCandidateContext(candidateId) {
  const candidate = await Candidate.findById(candidateId)
    .populate('userId', 'name email')
    .populate('jobId', 'title')
  return candidate
}

// ── Trigger 1: On application submit ─────────────────────────────────────────

export async function autoUpdateOnApplication(candidateId, matchScore) {
  try {
    const newStatus = matchScore >= THRESHOLDS.SCREENING ? 'screening' : 'applied'
    const note = newStatus === 'screening'
      ? `Auto-moved to screening (match score: ${matchScore}%)`
      : `Application received (match score: ${matchScore}%)`

    const updated = await Candidate.findByIdAndUpdate(
      candidateId,
      { status: newStatus, statusUpdatedAt: new Date(), statusNote: note },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title')

    if (!updated) return null

    console.log(`✅ Auto status: ${updated.userId?.email} → ${newStatus} (score: ${matchScore}%)`)

    // Send application received email
    await sendApplicationReceived({
      to: updated.userId.email,
      candidateName: updated.userId.name,
      jobTitle: updated.jobId.title,
      matchScore,
      status: newStatus
    })

    return updated
  } catch (err) {
    console.error('autoUpdateOnApplication error:', err.message)
  }
}

// ── Trigger 2: On interview link sent ────────────────────────────────────────

export async function autoUpdateOnInterviewSent(userId, jobId, interviewLink, expiresAt) {
  try {
    const updated = await Candidate.findOneAndUpdate(
      { userId, jobId, status: { $in: ['applied', 'screening'] } },
      {
        status: 'interviewed',
        statusUpdatedAt: new Date(),
        statusNote: 'Auto-moved to interviewed (AI interview link sent)'
      },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title')

    if (!updated) return null

    console.log(`✅ Auto status: ${updated.userId?.email} → interviewed`)

    // Send interview invite email
    await sendInterviewInvite({
      to: updated.userId.email,
      candidateName: updated.userId.name,
      jobTitle: updated.jobId.title,
      interviewLink,
      expiresAt
    })

    return updated
  } catch (err) {
    console.error('autoUpdateOnInterviewSent error:', err.message)
  }
}

// ── Trigger 3: On interview complete ─────────────────────────────────────────

export async function autoUpdateOnInterviewComplete(userId, jobId, interviewScore) {
  try {
    // Clean binary: >= 70 → hired, < 70 → rejected. No dead zone.
    const newStatus = interviewScore >= THRESHOLDS.HIRED ? 'hired' : 'rejected'
    const note = newStatus === 'hired'
      ? `Auto-hired (interview score: ${interviewScore}%)`
      : `Auto-rejected (interview score: ${interviewScore}% — below 70% threshold)`

    // Calculate combined score: 40% matchScore + 60% interviewScore
    const candidate = await Candidate.findOne({ userId, jobId })
    const matchScore = candidate?.matchScore || 0
    const combinedScore = Math.round((matchScore * 0.4) + (interviewScore * 0.6))

    const updated = await Candidate.findOneAndUpdate(
      { userId, jobId },
      { 
        status: newStatus, 
        interviewScore, 
        combinedScore,
        statusUpdatedAt: new Date(), 
        statusNote: note 
      },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title')

    if (!updated) return null

    console.log(`✅ Auto status: ${updated.userId?.email} → ${newStatus} (interview: ${interviewScore}%, combined: ${combinedScore}%)`)

    await sendStatusUpdate({
      to: updated.userId.email,
      candidateName: updated.userId.name,
      jobTitle: updated.jobId.title,
      newStatus,
      interviewScore,
      statusNote: note
    })

    return updated
  } catch (err) {
    console.error('autoUpdateOnInterviewComplete error:', err.message)
  }
}
