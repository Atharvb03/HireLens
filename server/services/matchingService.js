import Candidate from '../models/Candidate.js'
import { parseResumeWithAI, matchResumeToJobWithAI } from './aiResumeParser.js'

const SKILL_DICTIONARY = [
  'javascript','typescript','python','java','c++','c#','php','ruby','go','rust',
  'kotlin','swift','scala','r','matlab','perl','groovy','lua','dart',
  'react','vue','angular','svelte','next.js','nuxt','ember','backbone',
  'jquery','bootstrap','tailwind','material-ui','ant design',
  'express','express.js','fastapi','django','flask','spring','spring boot','laravel',
  'rails','asp.net','fastify','koa','hapi','nestjs',
  'mongodb','postgresql','mysql','redis','elasticsearch','cassandra',
  'dynamodb','firebase','oracle','sql server','mariadb','couchdb',
  'aws','azure','gcp','docker','kubernetes','jenkins','gitlab','github',
  'circleci','travis','terraform','ansible','heroku','vercel','netlify',
  'html','css','sass','less','webpack','vite','parcel','rollup',
  'rest','rest api','rest apis','restful','graphql','websocket','ajax','fetch','axios',
  'responsive','responsive design','responsive web',
  'machine learning','deep learning','nlp','computer vision','tensorflow',
  'pytorch','scikit-learn','pandas','numpy','keras','opencv',
  'agile','scrum','kanban','jira','confluence','communication',
  'leadership','teamwork','problem solving','critical thinking',
  'sql','nosql','orm','api','apis','microservices','serverless','ci/cd','devops',
  'git','node.js','nodejs','node','npm','yarn','testing','jest',
  'mocha','chai','selenium','cypress','postman','swagger',
  'html5','css3','excel','matplotlib','seaborn','multithreading'
]

// Expanded aliases — covers common resume variations
const SKILL_ALIASES = {
  'js': 'javascript',
  'nodejs': 'node.js',
  'node': 'node.js',
  'node js': 'node.js',
  'expressjs': 'express.js',
  'express js': 'express.js',
  'express': 'express.js',
  'reactjs': 'react',
  'react js': 'react',
  'vuejs': 'vue',
  'vue js': 'vue',
  'angularjs': 'angular',
  'nextjs': 'next.js',
  'next js': 'next.js',
  'restful api': 'rest apis',
  'restful apis': 'rest apis',
  'rest api': 'rest apis',
  'rest': 'rest apis',
  'responsive web design': 'responsive design',
  'responsive': 'responsive design',
  'scikit learn': 'scikit-learn',
  'sklearn': 'scikit-learn',
  'cv': 'computer vision',
  'ml': 'machine learning',
  'dl': 'deep learning',
  'html5': 'html',
  'css3': 'css',
  'vscode': 'vs code',
  'aws cloud': 'aws',
  'leadership qualities': 'leadership',
  'mongo': 'mongodb',
  'mongo db': 'mongodb',
  'postgres': 'postgresql',
  'pg': 'postgresql',
}

class MatchingService {
  preprocessText(text) {
    if (!text) return ''
    // Keep dots (for node.js, express.js), slashes (ci/cd), plus signs (c++)
    return text.toLowerCase().replace(/[^a-z0-9\s\-/+.#]/g,' ').replace(/\s+/g,' ').trim()
  }

  normalizeSkill(skill) {
    const n = skill.toLowerCase().trim()
    return SKILL_ALIASES[n] || n
  }

  extractSkillsWithFrequency(text) {
    const pre = this.preprocessText(text)
    const freq = {}

    // Check all dictionary skills
    for (const skill of SKILL_DICTIONARY) {
      try {
        // Escape regex special chars but keep . as literal dot
        const esc = skill.replace(/[*+?^${}()|[\]\\]/g,'\\$&').replace(/\./g,'\\.')
        // Use word boundary where possible; for multi-word skills use lookaround
        const pattern = skill.includes(' ')
          ? new RegExp(`(?<![a-z])${esc}(?![a-z])`, 'gi')
          : new RegExp(`\\b${esc}\\b`, 'gi')
        const m = pre.match(pattern)
        if (m) {
          const n = this.normalizeSkill(skill)
          freq[n] = (freq[n] || 0) + m.length
        }
      } catch { /* skip malformed */ }
    }

    // Check aliases
    for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
      try {
        const esc = alias.replace(/[*+?^${}()|[\]\\]/g,'\\$&').replace(/\./g,'\\.')
        const pattern = alias.includes(' ')
          ? new RegExp(`(?<![a-z])${esc}(?![a-z])`, 'gi')
          : new RegExp(`\\b${esc}\\b`, 'gi')
        const m = pre.match(pattern)
        if (m) freq[canonical] = (freq[canonical] || 0) + m.length
      } catch { /* skip */ }
    }

    return freq
  }

  normalizeJobSkills(jobSkills) {
    if (!Array.isArray(jobSkills)) return []
    return jobSkills.map(s => this.normalizeSkill(s))
  }

  _regexScore(resumeSkillFreq, jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 0
    const jobSet = new Set(this.normalizeJobSkills(jobSkills))
    let matched = 0, freqTotal = 0

    for (const skill of jobSet) {
      // Direct match
      if (resumeSkillFreq[skill]) {
        matched++
        freqTotal += (Math.min(resumeSkillFreq[skill], 5) / 5) * 100
        continue
      }
      // Partial match — job skill is substring of a resume skill or vice versa
      const resumeKeys = Object.keys(resumeSkillFreq)
      const partialMatch = resumeKeys.find(k =>
        k.includes(skill) || skill.includes(k) ||
        // handle "rest apis" matching "rest api" etc.
        k.replace(/s$/, '') === skill.replace(/s$/, '')
      )
      if (partialMatch) {
        matched += 0.8 // partial credit
        freqTotal += 60
      }
    }

    const coverage = (matched / jobSet.size) * 100
    return Math.min((coverage * 0.6) + ((freqTotal / jobSet.size) * 0.4), 100)
  }

  _buildGapSuggestions(missingSkills) {
    return missingSkills.map(s => ({
      skill: s,
      suggestion: `Learn ${s} to improve your match for this role`,
      resources: `Search for "${s} tutorials" or online courses`
    }))
  }

  /**
   * Main matching function.
   * Priority: AI parse + AI match → AI parse + regex score → full regex
   */
  async matchResumeToJob(resumeText, jobDescription, jobRequiredSkills, jobObject = null) {
    console.log('\n=== RESUME MATCHING START ===')
    console.log('Resume length:', resumeText?.length || 0)
    console.log('Required skills:', jobRequiredSkills)

    // Step 1: AI parse
    let parsedResume = null
    try { parsedResume = await parseResumeWithAI(resumeText) } catch (e) { console.warn('AI parse error:', e.message) }

    // Step 2: AI match (needs jobObject)
    if (parsedResume && jobObject) {
      let aiMatch = null
      try { aiMatch = await matchResumeToJobWithAI(parsedResume, jobObject) } catch (e) { console.warn('AI match error:', e.message) }
      if (aiMatch) {
        console.log('✅ AI match score:', aiMatch.matchScore)
        console.log('=== RESUME MATCHING END ===\n')
        return {
          matchScore: aiMatch.matchScore,
          skillMatchScore: aiMatch.skillMatchScore,
          experienceMatch: aiMatch.experienceMatch,
          educationMatch: aiMatch.educationMatch,
          projectRelevance: aiMatch.projectRelevance,
          extractedSkills: parsedResume.skills || [],
          matchedSkills: aiMatch.matchedSkills || [],
          missingSkills: aiMatch.missingSkills || [],
          skillGapSuggestions: aiMatch.skillGapSuggestions || [],
          overallAssessment: aiMatch.overallAssessment || '',
          strengths: aiMatch.strengths || [],
          concerns: aiMatch.concerns || [],
          parsedResume,
          source: 'ai'
        }
      }
    }

    // Step 3: AI skills + regex score
    if (parsedResume && parsedResume.skills?.length > 0) {
      console.log('⚡ AI skills + regex score')
      const aiFreq = {}
      for (const s of parsedResume.skills) aiFreq[this.normalizeSkill(s)] = 1
      const score = this._regexScore(aiFreq, jobRequiredSkills)
      const jobSet = new Set(this.normalizeJobSkills(jobRequiredSkills))
      const resumeSet = new Set(Object.keys(aiFreq))
      const matchedSkills = [...resumeSet].filter(s => jobSet.has(s))
      const missingSkills = [...jobSet].filter(s => !resumeSet.has(s))
      console.log('Score:', score)
      console.log('=== RESUME MATCHING END ===\n')
      return {
        matchScore: Math.round(score*100)/100,
        skillMatchScore: Math.round(score*100)/100,
        experienceMatch: 0, educationMatch: 0, projectRelevance: 0,
        extractedSkills: parsedResume.skills,
        matchedSkills, missingSkills,
        skillGapSuggestions: this._buildGapSuggestions(missingSkills),
        overallAssessment: '', strengths: [], concerns: [],
        parsedResume, source: 'ai-skills-regex-score'
      }
    }

    // Step 4: Full regex fallback
    console.log('⚠️  Full regex fallback')
    const freq = this.extractSkillsWithFrequency(resumeText)
    const resumeSkills = Object.keys(freq)
    const score = this._regexScore(freq, jobRequiredSkills)
    const jobSet = new Set(this.normalizeJobSkills(jobRequiredSkills))
    const resumeSet = new Set(resumeSkills)
    const matchedSkills = [...resumeSet].filter(s => jobSet.has(s))
    const missingSkills = [...jobSet].filter(s => !resumeSet.has(s))
    console.log('Score:', score)
    console.log('=== RESUME MATCHING END ===\n')
    return {
      matchScore: Math.round(score*100)/100,
      skillMatchScore: Math.round(score*100)/100,
      experienceMatch: 0, educationMatch: 0, projectRelevance: 0,
      extractedSkills: resumeSkills,
      matchedSkills, missingSkills,
      skillGapSuggestions: this._buildGapSuggestions(missingSkills),
      overallAssessment: '', strengths: [], concerns: [],
      parsedResume: null, source: 'regex'
    }
  }

  async rankCandidatesForJob(jobId) {
    try {
      const apps = await Candidate.find({ jobId }).populate('userId').populate('jobId')
      
      // Calculate combined score for each candidate: 40% matchScore + 60% interviewScore
      const appsWithCombinedScore = apps.map(app => {
        const matchScore = app.matchScore || 0
        const interviewScore = app.interviewScore || 0
        // If no interview score yet, use matchScore only for ranking
        const combinedScore = app.interviewScore != null 
          ? Math.round((matchScore * 0.4) + (interviewScore * 0.6))
          : matchScore
        return { ...app.toObject(), combinedScore }
      })
      
      // Sort by combined score (highest first)
      const sorted = appsWithCombinedScore.sort((a, b) => b.combinedScore - a.combinedScore)
      const ranked = sorted.map((a, i) => ({ ...a, rank: i + 1 }))
      
      // Update database with rank and combined score
      for (const c of ranked) {
        await Candidate.findByIdAndUpdate(c._id, { 
          rank: c.rank,
          combinedScore: c.combinedScore 
        })
      }
      
      return ranked
    } catch (e) { 
      console.error('rankCandidatesForJob:', e)
      return [] 
    }
  }

  async getRankedCandidates(jobId) {
    try {
      const candidates = await Candidate.find({ jobId }).populate('userId').populate('jobId').sort({ matchScore: -1 })
      return candidates.map((a,i) => ({ ...a.toObject(), rank: i+1 }))
    } catch (e) { console.error('getRankedCandidates:', e); return [] }
  }
}

export default new MatchingService()
