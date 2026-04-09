import Candidate from '../models/Candidate.js'
import JobPosting from '../models/JobPosting.js'

// Comprehensive skill dictionary with variations
const SKILL_DICTIONARY = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
  'kotlin', 'swift', 'scala', 'r', 'matlab', 'perl', 'groovy', 'lua', 'dart',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'ember', 'backbone',
  'jquery', 'bootstrap', 'tailwind', 'material-ui', 'ant design',
  'express', 'fastapi', 'django', 'flask', 'spring', 'spring boot', 'laravel',
  'rails', 'asp.net', 'fastify', 'koa', 'hapi', 'nestjs',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
  'dynamodb', 'firebase', 'oracle', 'sql server', 'mariadb', 'couchdb',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
  'circleci', 'travis', 'terraform', 'ansible', 'heroku', 'vercel', 'netlify',
  'html', 'css', 'sass', 'less', 'webpack', 'vite', 'parcel', 'rollup',
  'rest', 'graphql', 'websocket', 'ajax', 'fetch', 'axios',
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow',
  'pytorch', 'scikit-learn', 'pandas', 'numpy', 'keras', 'opencv',
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'slack', 'communication',
  'leadership', 'teamwork', 'problem solving', 'critical thinking',
  'sql', 'nosql', 'orm', 'api', 'microservices', 'serverless', 'ci/cd', 'devops',
  'git', 'node.js', 'nodejs', 'npm', 'yarn', 'testing', 'jest',
  'mocha', 'chai', 'selenium', 'cypress', 'postman', 'swagger',
  'html5', 'css3', 'js', 'excel', 'matplotlib', 'seaborn', 'scikit learn',
  'mysql workbench', 'mongodb compass', 'aws cloud', 'vs code', 'socket programming',
  'multithreading', 'logical thinking', 'decision making', 'leadership qualities'
]

// Skill aliases for better matching
const SKILL_ALIASES = {
  'js': 'javascript',
  'nodejs': 'node.js',
  'node': 'node.js',
  'scikit learn': 'scikit-learn',
  'sklearn': 'scikit-learn',
  'cv': 'computer vision',
  'ml': 'machine learning',
  'dl': 'deep learning',
  'html5': 'html',
  'css3': 'css',
  'vs code': 'vs code',
  'vscode': 'vs code',
  'mysql workbench': 'mysql workbench',
  'mongodb compass': 'mongodb compass',
  'aws cloud': 'aws',
  'socket programming': 'socket programming',
  'multithreading': 'multithreading',
  'logical thinking': 'logical thinking',
  'decision making': 'decision making',
  'leadership qualities': 'leadership'
}

class MatchingService {
  // Preprocess text
  preprocessText(text) {
    if (!text) return ''
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s\-/+.()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Normalize skill name for comparison
  normalizeSkill(skill) {
    const normalized = skill.toLowerCase().trim()
    return SKILL_ALIASES[normalized] || normalized
  }

  // Extract skills from text with frequency
  extractSkillsWithFrequency(text) {
    const preprocessed = this.preprocessText(text)
    const skillFrequency = {}

    // First pass: check dictionary skills
    for (const skill of SKILL_DICTIONARY) {
      try {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'gi')
        const matches = preprocessed.match(pattern)
        
        if (matches && matches.length > 0) {
          const normalized = this.normalizeSkill(skill)
          skillFrequency[normalized] = (skillFrequency[normalized] || 0) + matches.length
        }
      } catch (e) {
        console.warn(`Skipping skill: ${skill}`)
      }
    }

    // Second pass: check for skill aliases in text
    for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
      try {
        const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const pattern = new RegExp(`\\b${escapedAlias}\\b`, 'gi')
        const matches = preprocessed.match(pattern)
        
        if (matches && matches.length > 0) {
          skillFrequency[canonical] = (skillFrequency[canonical] || 0) + matches.length
        }
      } catch (e) {
        console.warn(`Skipping alias: ${alias}`)
      }
    }

    return skillFrequency
  }

  // Normalize job skills for comparison
  normalizeJobSkills(jobSkills) {
    if (!jobSkills || !Array.isArray(jobSkills)) return []
    
    return jobSkills.map(skill => {
      const normalized = this.normalizeSkill(skill)
      return normalized
    })
  }

  // Simple skill-based matching only
  calculateSkillMatchScore(resumeSkillFreq, jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 0

    const normalizedJobSkills = this.normalizeJobSkills(jobSkills)
    const jobSkillsSet = new Set(normalizedJobSkills)
    
    let matchedCount = 0
    let totalFrequencyScore = 0

    console.log('DEBUG - Job Skills (normalized):', Array.from(jobSkillsSet))
    console.log('DEBUG - Resume Skills Found:', Object.keys(resumeSkillFreq))

    for (const jobSkill of jobSkillsSet) {
      if (resumeSkillFreq[jobSkill]) {
        matchedCount++
        // Frequency-based scoring: more mentions = higher score
        const frequency = Math.min(resumeSkillFreq[jobSkill], 5) // Cap at 5
        const frequencyScore = (frequency / 5) * 100
        totalFrequencyScore += frequencyScore
        console.log(`MATCHED: ${jobSkill} (frequency: ${resumeSkillFreq[jobSkill]})`)
      } else {
        console.log(`MISSING: ${jobSkill}`)
      }
    }

    // Calculate percentage of required skills found
    const skillCoverageScore = (matchedCount / jobSkillsSet.size) * 100
    
    // Weighted average: 60% coverage, 40% frequency
    const finalScore = (skillCoverageScore * 0.6) + ((totalFrequencyScore / jobSkillsSet.size) * 0.4)
    
    console.log('DEBUG - Match Calculation:', {
      matchedCount,
      totalSkills: jobSkillsSet.size,
      skillCoverageScore: Math.round(skillCoverageScore),
      frequencyScore: Math.round(totalFrequencyScore / jobSkillsSet.size),
      finalScore: Math.round(finalScore)
    })
    
    return Math.min(finalScore, 100)
  }

  // Main matching function - SKILLS ONLY
  async matchResumeToJob(resumeText, jobDescription, jobRequiredSkills) {
    try {
      console.log('\n=== MATCHING DEBUG START ===')
      console.log('Resume Text Length:', resumeText?.length || 0)
      console.log('Job Required Skills:', jobRequiredSkills)

      // Extract skills with frequency
      const resumeSkillFreq = this.extractSkillsWithFrequency(resumeText)
      const resumeSkills = Object.keys(resumeSkillFreq)

      console.log('Extracted Resume Skills:', resumeSkills)

      // Calculate skill match score only
      const matchScore = this.calculateSkillMatchScore(resumeSkillFreq, jobRequiredSkills)

      console.log('Final Match Score:', matchScore)
      console.log('=== MATCHING DEBUG END ===\n')

      return {
        matchScore: Math.round(matchScore * 100) / 100,
        skillMatchScore: Math.round(matchScore * 100) / 100,
        extractedSkills: resumeSkills
      }
    } catch (error) {
      console.error('Error in matchResumeToJob:', error)
      return {
        matchScore: 0,
        skillMatchScore: 0,
        extractedSkills: []
      }
    }
  }

  // Rank candidates for a job
  async rankCandidatesForJob(jobId) {
    try {
      const applications = await Candidate.find({ jobId })
        .populate('userId')
        .populate('jobId')
        .sort({ matchScore: -1 })

      const rankedCandidates = applications.map((app, index) => ({
        ...app.toObject(),
        rank: index + 1
      }))

      for (const candidate of rankedCandidates) {
        await Candidate.findByIdAndUpdate(
          candidate._id,
          { rank: candidate.rank },
          { new: true }
        )
      }

      return rankedCandidates
    } catch (error) {
      console.error('Error in rankCandidatesForJob:', error)
      return []
    }
  }

  // Get ranked candidates for a job
  async getRankedCandidates(jobId) {
    try {
      const candidates = await Candidate.find({ jobId })
        .populate('userId')
        .populate('jobId')
        .sort({ matchScore: -1 })

      return candidates.map((app, index) => ({
        ...app.toObject(),
        rank: index + 1
      }))
    } catch (error) {
      console.error('Error in getRankedCandidates:', error)
      return []
    }
  }
}

export default new MatchingService()
