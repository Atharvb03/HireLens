// Quick test of the matching algorithm
const SKILL_DICTIONARY = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'express', 'fastapi', 'django', 'flask',
  'node.js', 'nodejs', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'gitlab', 'github',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui', 'rest', 'graphql', 'websocket',
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'scikit-learn',
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'slack', 'communication', 'leadership',
  'sql', 'nosql', 'orm', 'api', 'microservices', 'serverless', 'ci/cd', 'devops'
]

function preprocessText(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-/+.]/g, ' ')  // Keep dots for node.js
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSkills(text) {
  const preprocessed = preprocessText(text)
  const extractedSkills = []

  for (const skill of SKILL_DICTIONARY) {
    // Escape special regex characters
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'gi')
    if (pattern.test(preprocessed)) {
      extractedSkills.push(skill.toLowerCase())
    }
  }

  return [...new Set(extractedSkills)]
}

function calculateSkillMatchScore(resumeSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return 0

  const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase()))
  const jobSkillsSet = new Set(jobSkills.map(s => s.toLowerCase()))

  const matchedSkills = [...resumeSkillsSet].filter(skill => jobSkillsSet.has(skill))
  const score = (matchedSkills.length / jobSkillsSet.size) * 100

  return Math.min(score, 100)
}

function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0

  const words1 = new Set(preprocessText(text1).split(/\s+/).filter(w => w.length > 2))
  const words2 = new Set(preprocessText(text2).split(/\s+/).filter(w => w.length > 2))

  if (words1.size === 0 || words2.size === 0) return 0

  const intersection = [...words1].filter(word => words2.has(word))
  const union = new Set([...words1, ...words2])

  return (intersection.length / union.size) * 100
}

// Test data
const resumeText = `
John Doe
Senior React Developer

SKILLS:
- React
- JavaScript
- Node.js
- MongoDB
- Express
- REST APIs
- TypeScript
- CSS

EXPERIENCE:
- 3 years as React Developer at Tech Company
- Built multiple React applications with Redux
- Worked with Node.js backend and Express
- MongoDB database design and optimization
- REST API development
- Team lead for 2 developers

EDUCATION:
- Bachelor's in Computer Science
- Completed React Advanced Course
- Node.js Certification

PROJECTS:
- E-commerce platform using React and Node.js
- Real-time chat application with WebSockets
- Dashboard with data visualization
`

const jobDescription = `We are looking for an experienced React developer with strong JavaScript skills. Must have experience with Node.js and MongoDB. You should be familiar with Express and REST APIs.`

const jobRequiredSkills = ['React', 'JavaScript', 'Node.js', 'MongoDB']

// Run test
console.log('=== MATCHING TEST ===\n')

const resumeSkills = extractSkills(resumeText)
console.log('Extracted Skills:', resumeSkills)

const skillMatchScore = calculateSkillMatchScore(resumeSkills, jobRequiredSkills)
console.log('Skill Match Score:', skillMatchScore + '%')

const semanticSimilarity = calculateTextSimilarity(resumeText, jobDescription)
console.log('Semantic Similarity:', semanticSimilarity + '%')

const matchScore = (skillMatchScore * 0.4) + (semanticSimilarity * 0.6)
console.log('Final Match Score:', Math.round(matchScore * 100) / 100 + '%')

console.log('\n=== EXPECTED RESULTS ===')
console.log('Extracted Skills: Should include react, javascript, node.js, mongodb, express')
console.log('Skill Match Score: Should be 100% (all 4 required skills present)')
console.log('Semantic Similarity: Should be 70-80%')
console.log('Final Match Score: Should be 82-88%')
