import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Try to get API key from environment
let apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY

console.log('Interview Service Initialized')
console.log('API Key from env:', !!apiKey)

// If not found, try to load from .env file directly
if (!apiKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env')
    console.log('Looking for .env at:', envPath)
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      const lines = envContent.split('\n')
      for (const line of lines) {
        if (line.startsWith('GEMINI_API_KEY=')) {
          apiKey = line.split('=')[1].trim()
          console.log('✅ Loaded GEMINI_API_KEY from .env file')
          break
        }
      }
    } else {
      console.log('⚠️ .env file not found at:', envPath)
    }
  } catch (error) {
    console.error('Error reading .env file:', error.message)
  }
}

console.log('API Key configured:', !!apiKey)
if (apiKey) {
  console.log('Using API Key:', apiKey.substring(0, 10) + '...')
}

let genAI = null

// Initialize Gemini API
function initializeGeminiAPI() {
  try {
    if (apiKey) {
      genAI = new GoogleGenerativeAI(apiKey)
      console.log('✅ Gemini API client initialized successfully')
      return true
    } else {
      console.log('⚠️ No API key configured - will use fallback evaluation')
      return false
    }
  } catch (error) {
    console.error('❌ Error initializing Gemini API:', error.message)
    console.log('Will use fallback evaluation')
    genAI = null
    return false
  }
}

// Initialize on module load
initializeGeminiAPI()

/**
 * Generate interview questions using Gemini API
 */
export async function generateInterviewQuestions({ jobRole, jobDescription, requiredSkills, candidateSkills }) {
  try {
    console.log('\n=== GENERATING INTERVIEW QUESTIONS ===')
    console.log('Job Role:', jobRole)
    console.log('Gemini API Available:', !!genAI)
    console.log('API Key Configured:', !!apiKey)

    // If no API key or genAI not initialized, use fallback immediately
    if (!genAI || !apiKey) {
      console.log('⚠️ Using fallback questions (Gemini API not available)')
      return generateFallbackQuestions(jobRole)
    }

    console.log('🔄 Attempting to generate questions with Gemini API...')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Add randomization to ensure different questions each time
    const randomSeed = Math.random().toString(36).substring(7)

    const prompt = `You are an expert technical interviewer. Generate 10 UNIQUE and DIFFERENT domain-specific interview questions for a ${jobRole} position.

IMPORTANT: Generate COMPLETELY DIFFERENT questions each time this is called. Do NOT repeat common questions.
Random seed: ${randomSeed}

Job Description: ${jobDescription || 'General interview'}
Required Skills: ${(requiredSkills && requiredSkills.length > 0) ? requiredSkills.join(', ') : 'General technical skills'}

Generate 10 technical interview questions that:
1. Are HIGHLY SPECIFIC to the ${jobRole} role and required skills
2. Test practical knowledge and experience in this domain
3. Are appropriate for assessing job-specific competencies
4. Mix different question types (short_answer, descriptive, coding)
5. Progress from easy to hard
6. Focus on real-world scenarios and problems in this field
7. Are UNIQUE and DIFFERENT from typical interview questions
8. Cover different aspects of the role (not just the same topics)
9. Include both theoretical and practical questions
10. Test both technical skills and soft skills

Examples for different roles:
- For Frontend Developer: Ask about React/Vue/Angular, CSS, responsive design, performance optimization, accessibility, state management, testing, debugging, user experience, etc.
- For Backend Developer: Ask about databases, APIs, scalability, security, system design, caching, authentication, microservices, performance, monitoring, etc.
- For Data Scientist: Ask about ML algorithms, data preprocessing, statistical analysis, model evaluation, feature engineering, data visualization, etc.
- For DevOps: Ask about containerization, CI/CD, infrastructure, monitoring, deployment, logging, security, automation, etc.

VARY THE QUESTIONS: Each time you generate, create completely different questions. Don't ask the same questions repeatedly.

Return the response as a JSON array with this format:
[
  {
    "question": "Question text here - MUST be specific to ${jobRole} and UNIQUE",
    "type": "short_answer|descriptive|coding",
    "difficulty": "easy|medium|hard"
  }
]

Only return the JSON array, no other text.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    console.log('✅ Gemini API response received')

    // Parse JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('❌ Invalid response format from Gemini API')
      console.log('Response was:', responseText)
      return generateFallbackQuestions(jobRole)
    }

    const questions = JSON.parse(jsonMatch[0])
    console.log(`✅ Generated ${questions.length} unique questions with Gemini API`)
    console.log('=== QUESTIONS GENERATED ===\n')

    return questions
  } catch (error) {
    console.error('❌ Error generating questions with Gemini:', error.message)
    console.log('Stack:', error.stack)
    console.log('⚠️ Falling back to fallback questions')
    return generateFallbackQuestions(jobRole)
  }
}

/**
 * Generate fallback questions when Gemini API fails
 * Generates varied questions by shuffling and selecting random ones
 */
function generateFallbackQuestions(jobRole) {
  // Extended domain-specific fallback questions based on job role (10+ per role)
  const questionsByRole = {
    'frontend': [
      { question: 'Explain the difference between state and props in React', type: 'descriptive', difficulty: 'easy' },
      { question: 'How would you optimize a slow-rendering React component?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your approach to responsive web design', type: 'descriptive', difficulty: 'medium' },
      { question: 'What is the CSS box model and how does it work?', type: 'short_answer', difficulty: 'easy' },
      { question: 'How do you handle asynchronous operations in JavaScript?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What are React hooks and how do they improve component logic?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Explain the concept of virtual DOM and its benefits', type: 'descriptive', difficulty: 'medium' },
      { question: 'How would you implement lazy loading for images in a web application?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What is the difference between controlled and uncontrolled components?', type: 'short_answer', difficulty: 'medium' },
      { question: 'Describe your approach to testing React components', type: 'descriptive', difficulty: 'hard' },
      { question: 'How do you handle state management in large applications?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What are the best practices for CSS organization?', type: 'descriptive', difficulty: 'medium' }
    ],
    'backend': [
      { question: 'Explain the difference between SQL and NoSQL databases', type: 'descriptive', difficulty: 'easy' },
      { question: 'How would you design a scalable REST API?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What is the purpose of database indexing?', type: 'short_answer', difficulty: 'medium' },
      { question: 'Describe your approach to handling authentication and authorization', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you ensure data consistency in distributed systems?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What are microservices and what are their advantages?', type: 'descriptive', difficulty: 'medium' },
      { question: 'How would you implement caching in a backend system?', type: 'descriptive', difficulty: 'hard' },
      { question: 'Explain the concept of database transactions and ACID properties', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you handle API rate limiting and throttling?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your approach to error handling and logging', type: 'descriptive', difficulty: 'medium' },
      { question: 'What is your experience with message queues?', type: 'descriptive', difficulty: 'hard' },
      { question: 'How do you optimize database queries?', type: 'descriptive', difficulty: 'hard' }
    ],
    'fullstack': [
      { question: 'Explain the MVC architecture pattern', type: 'descriptive', difficulty: 'easy' },
      { question: 'How would you optimize both frontend and backend performance?', type: 'descriptive', difficulty: 'hard' },
      { question: 'Describe your approach to API design and documentation', type: 'descriptive', difficulty: 'medium' },
      { question: 'What security measures do you implement in web applications?', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you handle real-time data synchronization between client and server?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What is your approach to database schema design?', type: 'descriptive', difficulty: 'medium' },
      { question: 'How would you implement user authentication and session management?', type: 'descriptive', difficulty: 'hard' },
      { question: 'Describe your approach to handling file uploads and storage', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you ensure code quality and maintainability?', type: 'descriptive', difficulty: 'medium' },
      { question: 'What is your experience with deployment and DevOps practices?', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you handle testing across frontend and backend?', type: 'descriptive', difficulty: 'hard' },
      { question: 'Describe your approach to monitoring and debugging production issues', type: 'descriptive', difficulty: 'hard' }
    ],
    'devops': [
      { question: 'Explain containerization and Docker', type: 'descriptive', difficulty: 'easy' },
      { question: 'How would you design a CI/CD pipeline?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What monitoring and logging strategies do you use?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your approach to infrastructure as code', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you handle disaster recovery and backup strategies?', type: 'descriptive', difficulty: 'hard' },
      { question: 'What is Kubernetes and how does it manage containerized applications?', type: 'descriptive', difficulty: 'hard' },
      { question: 'How would you implement auto-scaling for applications?', type: 'descriptive', difficulty: 'hard' },
      { question: 'Describe your approach to security in cloud infrastructure', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you manage secrets and sensitive data in production?', type: 'descriptive', difficulty: 'medium' },
      { question: 'What is your experience with different cloud providers?', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you optimize cloud costs?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your approach to load balancing and traffic management', type: 'descriptive', difficulty: 'hard' }
    ],
    'data-science': [
      { question: 'Explain the difference between supervised and unsupervised learning', type: 'descriptive', difficulty: 'easy' },
      { question: 'How do you handle missing data in a dataset?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your approach to feature engineering', type: 'descriptive', difficulty: 'medium' },
      { question: 'What metrics do you use to evaluate model performance?', type: 'short_answer', difficulty: 'medium' },
      { question: 'How would you approach a complex machine learning problem?', type: 'descriptive', difficulty: 'hard' },
      { question: 'Explain the bias-variance tradeoff in machine learning', type: 'descriptive', difficulty: 'hard' },
      { question: 'How do you prevent overfitting in machine learning models?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your experience with deep learning frameworks', type: 'descriptive', difficulty: 'hard' },
      { question: 'How would you handle imbalanced datasets?', type: 'descriptive', difficulty: 'medium' },
      { question: 'What is your approach to model deployment and monitoring?', type: 'descriptive', difficulty: 'medium' },
      { question: 'How do you perform exploratory data analysis?', type: 'descriptive', difficulty: 'medium' },
      { question: 'Describe your experience with data visualization tools', type: 'descriptive', difficulty: 'medium' }
    ]
  }

  // Determine role category
  const roleLower = jobRole.toLowerCase()
  let allQuestions = questionsByRole['fullstack'] // default

  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('vue')) {
    allQuestions = questionsByRole['frontend']
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('python')) {
    allQuestions = questionsByRole['backend']
  } else if (roleLower.includes('devops') || roleLower.includes('kubernetes') || roleLower.includes('docker')) {
    allQuestions = questionsByRole['devops']
  } else if (roleLower.includes('data') || roleLower.includes('ml') || roleLower.includes('ai')) {
    allQuestions = questionsByRole['data-science']
  }

  // Shuffle questions and select 10 random ones for variety
  const shuffled = allQuestions.sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 10)

  console.log(`Selected ${selected.length} varied fallback questions for ${jobRole}`)
  return selected
}

/**
 * Evaluate answer using Gemini API
 */
export async function evaluateAnswer({ question, answer, questionType }) {
  try {
    console.log(`\n=== EVALUATING ANSWER ===`)
    console.log(`Question Type: ${questionType}`)
    console.log(`Answer Length: ${answer.length} characters`)
    console.log(`Gemini API Available: ${!!genAI}`)
    console.log(`API Key Configured: ${!!apiKey}`)

    // If no API or genAI not initialized, use fallback immediately
    if (!genAI || !apiKey) {
      console.log('⚠️ Using fallback evaluation (Gemini API not available)')
      return generateFallbackEvaluation(answer, question)
    }

    console.log('🔄 Attempting to evaluate with Gemini API...')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer to a technical question.

Question: ${question}
Question Type: ${questionType}
Candidate's Answer: ${answer}

IMPORTANT: Evaluate STRICTLY and provide a score that properly differentiates between good and bad answers.

Provide:
1. A score from 0-100 based on:
   - Accuracy and correctness (40%)
   - Completeness and depth (30%)
   - Clarity and communication (20%)
   - Relevance to the question (10%)

2. Detailed feedback on the answer

3. Strengths in the answer (what was done well)

4. Areas for improvement (what was missing or incorrect)

STRICT SCORING GUIDELINES:
- 0-15: Completely wrong, irrelevant, or no real answer provided
- 16-30: Severely incomplete or mostly incorrect with major gaps
- 31-45: Partially correct but missing key concepts or has significant errors
- 46-60: Mostly correct but lacks depth, detail, or has minor errors
- 61-75: Good answer with most key points covered and reasonable depth
- 76-85: Very good answer with comprehensive coverage and strong understanding
- 86-100: Excellent answer with thorough coverage, nuanced understanding, and strong technical knowledge

IMPORTANT: Do NOT give high scores (70+) unless the answer truly demonstrates strong understanding with good depth and detail.
Do NOT give the same score to all answers - differentiate based on actual quality.

Return the response as a JSON object with this format:
{
  "score": 65,
  "feedback": "Your answer demonstrates understanding of the concept but lacks some depth...",
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Area 1", "Area 2"]
}

Only return the JSON object, no other text.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    console.log('✅ Gemini API response received')
    console.log('Response preview:', responseText.substring(0, 100) + '...')

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('❌ Invalid response format from Gemini API')
      console.log('Response was:', responseText)
      return generateFallbackEvaluation(answer, question)
    }

    const evaluation = JSON.parse(jsonMatch[0])
    
    // Ensure score is within valid range
    evaluation.score = Math.max(0, Math.min(100, evaluation.score))
    
    console.log(`✅ Answer evaluated by Gemini. Score: ${evaluation.score}%`)
    console.log('=== EVALUATION COMPLETE ===\n')

    return evaluation
  } catch (error) {
    console.error('❌ Error evaluating answer with Gemini:', error.message)
    console.log('Stack:', error.stack)
    console.log('⚠️ Falling back to fallback evaluation')
    return generateFallbackEvaluation(answer, question)
  }
}

/**
 * Generate fallback evaluation when Gemini API fails
 * Uses intelligent content analysis instead of just length
 */
function generateFallbackEvaluation(answer, question) {
  const answerLower = answer.toLowerCase().trim()
  const questionLower = question.toLowerCase()
  
  // Check answer length and quality
  const answerLength = answer.trim().length
  const wordCount = answer.trim().split(/\s+/).length
  const sentences = answer.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length
  
  let score = 0
  let feedback = ''
  let strengths = []
  let improvements = []

  // CRITICAL: Very short answers are almost always wrong
  if (answerLength < 10 || wordCount < 3) {
    score = 5
    feedback = 'Answer is incomplete or too brief. This does not demonstrate understanding of the question.'
    improvements = ['Provide a complete answer', 'Explain your understanding', 'Include relevant details']
    return {
      score: Math.max(0, Math.min(100, score)),
      feedback: feedback,
      strengths: [],
      improvements: improvements
    }
  }

  // Very short answers (1-2 sentences) - likely incomplete
  if (wordCount < 15) {
    score = 20
    feedback = 'Answer is too brief and lacks necessary detail. Please provide more comprehensive explanation.'
    improvements = ['Expand your answer with more details', 'Explain the reasoning', 'Include examples or use cases']
  }
  // Short answers (15-50 words) - basic but incomplete
  else if (wordCount < 50) {
    score = 35
    feedback = 'Answer shows basic understanding but lacks depth and detail. Consider providing more comprehensive explanation.'
    strengths = ['Attempted to answer the question', 'Covered basic concept']
    improvements = ['Add more specific details', 'Include examples', 'Explain the reasoning behind your answer']
  }
  // Medium-short answers (50-100 words) - decent but could be better
  else if (wordCount < 100) {
    score = 50
    feedback = 'Answer covers the main concept but could be more comprehensive. Good foundation, but needs more depth.'
    strengths = ['Covered main points', 'Provided basic explanation']
    improvements = ['Add more technical depth', 'Include real-world examples', 'Discuss edge cases or limitations']
  }
  // Medium answers (100-200 words) - good
  else if (wordCount < 200) {
    score = 65
    feedback = 'Good answer with solid understanding. Covers most key points with reasonable depth and clarity.'
    strengths = ['Comprehensive explanation', 'Clear structure', 'Covered multiple aspects']
    improvements = ['Add more specific examples', 'Discuss advanced concepts', 'Consider edge cases']
  }
  // Long answers (200-400 words) - very good
  else if (wordCount < 400) {
    score = 78
    feedback = 'Very good answer demonstrating strong understanding. Well-structured with good depth and multiple perspectives.'
    strengths = ['Thorough explanation', 'Clear and well-organized', 'Covered multiple perspectives', 'Good use of examples']
    improvements = ['Could mention advanced techniques', 'Consider performance implications', 'Discuss best practices']
  }
  // Very long answers (400+ words) - excellent
  else {
    score = 85
    feedback = 'Excellent answer demonstrating comprehensive understanding. Well-structured, detailed, and covers multiple aspects thoroughly.'
    strengths = ['Thorough and comprehensive', 'Excellent organization', 'Multiple perspectives covered', 'Strong use of examples', 'Demonstrates deep knowledge']
    improvements = ['Could discuss edge cases', 'Consider mentioning related concepts']
  }

  // QUALITY INDICATORS - Add points for good content
  let qualityBonus = 0

  // Check for examples (strong indicator of understanding)
  if (answerLower.includes('example') || answerLower.includes('for instance') || answerLower.includes('such as')) {
    qualityBonus += 8
    strengths.push('Included relevant examples')
  }

  // Check for nuanced understanding (shows critical thinking)
  if (answerLower.includes('however') || answerLower.includes('but') || answerLower.includes('although') || answerLower.includes('on the other hand')) {
    qualityBonus += 7
    strengths.push('Showed nuanced understanding')
  }

  // Check for reasoning explanation
  if (answerLower.includes('because') || answerLower.includes('reason') || answerLower.includes('why') || answerLower.includes('therefore')) {
    qualityBonus += 5
    strengths.push('Explained reasoning clearly')
  }

  // Check for technical depth
  if (answerLower.includes('algorithm') || answerLower.includes('complexity') || answerLower.includes('optimization') || 
      answerLower.includes('performance') || answerLower.includes('scalability') || answerLower.includes('architecture')) {
    qualityBonus += 6
    strengths.push('Demonstrated technical depth')
  }

  // Check for best practices
  if (answerLower.includes('best practice') || answerLower.includes('standard') || answerLower.includes('convention') || answerLower.includes('pattern')) {
    qualityBonus += 5
    strengths.push('Referenced best practices')
  }

  // Check for multiple sentences (shows structure)
  if (sentences >= 3) {
    qualityBonus += 3
    if (!strengths.includes('Well-structured')) {
      strengths.push('Well-structured answer')
    }
  }

  // QUALITY PENALTIES - Deduct points for poor content
  let qualityPenalty = 0

  // Check for vague or generic answers
  if (answerLower === 'yes' || answerLower === 'no' || answerLower === 'i don\'t know' || answerLower === 'not sure') {
    qualityPenalty += 40
    feedback = 'Answer is too vague or incomplete. Please provide a detailed explanation.'
    improvements = ['Provide a complete answer', 'Explain your understanding', 'Include relevant details']
  }

  // Check for obvious filler/padding
  if (answerLower.includes('lorem ipsum') || answerLower.includes('blah') || answerLower.includes('etc')) {
    qualityPenalty += 30
    feedback = 'Answer appears to contain filler content. Please provide a genuine, thoughtful response.'
  }

  // Apply bonuses and penalties
  score = Math.max(0, Math.min(100, score + qualityBonus - qualityPenalty))

  // Ensure we have feedback
  if (!feedback) {
    if (score >= 80) {
      feedback = 'Excellent answer demonstrating strong understanding and technical knowledge.'
    } else if (score >= 65) {
      feedback = 'Good answer with solid understanding and reasonable depth.'
    } else if (score >= 50) {
      feedback = 'Acceptable answer covering main points but could be more comprehensive.'
    } else if (score >= 35) {
      feedback = 'Answer shows basic understanding but lacks necessary depth and detail.'
    } else {
      feedback = 'Answer is incomplete or does not adequately address the question.'
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    feedback: feedback,
    strengths: strengths.length > 0 ? strengths : ['Attempted to answer'],
    improvements: improvements.length > 0 ? improvements : ['Provide more detail']
  }
}
