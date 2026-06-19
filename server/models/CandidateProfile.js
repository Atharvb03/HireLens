import mongoose from 'mongoose'

const candidateProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Basic info
  headline: { type: String, default: '' },          // e.g. "Full Stack Developer | 3 years exp"
  summary: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  availability: { type: String, enum: ['immediate', 'notice_period', 'not_looking'], default: 'immediate' },
  noticePeriod: { type: String, default: '' },

  // Skills — flat list
  skills: [{ type: String }],

  // Work experience
  experience: [{
    company: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: String },                    // "Jan 2022"
    endDate: { type: String, default: 'Present' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
  }],

  // Education
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, default: '' },
    startYear: { type: String },
    endYear: { type: String },
    gpa: { type: String, default: '' },
  }],

  // Portfolio / links
  portfolioLinks: [{
    label: { type: String },                        // "GitHub", "Portfolio", "LinkedIn"
    url: { type: String },
  }],

  // Certifications
  certifications: [{ type: String }],

  // Cached resume text generated from profile (used for matching without file upload)
  generatedResumeText: { type: String, default: '' },
  resumeTextUpdatedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Auto-generate resume text before save
candidateProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  this.generatedResumeText = buildResumeText(this)
  this.resumeTextUpdatedAt = new Date()
  next()
})

function buildResumeText(profile) {
  const lines = []

  if (profile.headline) lines.push(profile.headline)
  if (profile.summary) lines.push('\nSUMMARY\n' + profile.summary)

  if (profile.skills?.length) {
    lines.push('\nSKILLS\n' + profile.skills.join(', '))
  }

  if (profile.experience?.length) {
    lines.push('\nEXPERIENCE')
    for (const exp of profile.experience) {
      lines.push(`${exp.title} at ${exp.company} (${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''})`)
      if (exp.description) lines.push(exp.description)
    }
  }

  if (profile.education?.length) {
    lines.push('\nEDUCATION')
    for (const edu of profile.education) {
      lines.push(`${edu.degree}${edu.field ? ' in ' + edu.field : ''} — ${edu.institution} (${edu.startYear || ''} - ${edu.endYear || ''})`)
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`)
    }
  }

  if (profile.certifications?.length) {
    lines.push('\nCERTIFICATIONS\n' + profile.certifications.join(', '))
  }

  if (profile.portfolioLinks?.length) {
    lines.push('\nLINKS')
    for (const link of profile.portfolioLinks) {
      lines.push(`${link.label}: ${link.url}`)
    }
  }

  return lines.join('\n')
}

export default mongoose.model('CandidateProfile', candidateProfileSchema)
