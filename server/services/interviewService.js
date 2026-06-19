import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
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

// Model fallback chain — tries Gemini models, then OpenAI
const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash']
let _openai = null

function getOpenAI() {
  if (_openai) return _openai
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  _openai = new OpenAI({ apiKey: key })
  return _openai
}

async function generateWithFallback(prompt) {
  // Try Gemini first
  if (genAI) {
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        console.log(`✅ Interview model used: ${modelName}`)
        return result.response.text()
      } catch (err) {
        const skip = err.message?.includes('429') || err.message?.includes('quota') ||
                     err.message?.includes('404') || err.message?.includes('not found')
        if (skip) { console.warn(`⚠️  ${modelName} skipped: ${err.message?.split('\n')[0]}`); continue }
        throw err
      }
    }
    console.warn('⚠️  All Gemini models exhausted — trying OpenAI fallback')
  }

  // OpenAI fallback
  const openai = getOpenAI()
  if (openai) {
    try {
      console.log('🔄 Trying OpenAI gpt-4o-mini for interview...')
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      })
      console.log('✅ OpenAI gpt-4o-mini succeeded')
      return response.choices[0].message.content?.trim()
    } catch (err) {
      console.error('❌ OpenAI fallback failed:', err.message)
    }
  }

  console.error('❌ All AI providers exhausted for interview service')
  return null
}

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

    const responseText = await generateWithFallback(prompt)
    if (!responseText) return generateFallbackQuestions(jobRole)

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
 * Generate fallback questions — 20 role categories, 12 questions each
 */
function generateFallbackQuestions(jobRole) {
  const q = (question, type, difficulty) => ({ question, type, difficulty })
  const bank = {
    'frontend':        [ q('Explain the difference between state and props in React','descriptive','easy'), q('How would you optimize a slow-rendering React component?','descriptive','medium'), q('Describe your approach to responsive web design','descriptive','medium'), q('What is the CSS box model and how does it work?','short_answer','easy'), q('How do you handle asynchronous operations in JavaScript?','descriptive','hard'), q('What are React hooks and how do they improve component logic?','descriptive','medium'), q('Explain the concept of virtual DOM and its benefits','descriptive','medium'), q('How would you implement lazy loading for images?','descriptive','hard'), q('What is the difference between controlled and uncontrolled components?','short_answer','medium'), q('Describe your approach to testing React components','descriptive','hard'), q('How do you handle state management in large applications?','descriptive','hard'), q('What are the best practices for CSS organization and naming conventions?','descriptive','medium') ],
    'backend':         [ q('Explain the difference between SQL and NoSQL databases','descriptive','easy'), q('How would you design a scalable REST API?','descriptive','hard'), q('What is the purpose of database indexing and when would you use it?','short_answer','medium'), q('Describe your approach to handling authentication and authorization','descriptive','medium'), q('How do you ensure data consistency in distributed systems?','descriptive','hard'), q('What are microservices and their advantages over monoliths?','descriptive','medium'), q('How would you implement caching in a backend system?','descriptive','hard'), q('Explain database transactions and ACID properties','descriptive','medium'), q('How do you handle API rate limiting and throttling?','descriptive','medium'), q('Describe your approach to error handling and structured logging','descriptive','medium'), q('What is your experience with message queues like RabbitMQ or Kafka?','descriptive','hard'), q('How do you optimize slow database queries?','descriptive','hard') ],
    'fullstack':       [ q('Explain the MVC architecture pattern and its benefits','descriptive','easy'), q('How would you optimize both frontend and backend performance?','descriptive','hard'), q('Describe your approach to API design and documentation','descriptive','medium'), q('What security measures do you implement in web applications?','descriptive','medium'), q('How do you handle real-time data synchronization between client and server?','descriptive','hard'), q('What is your approach to database schema design?','descriptive','medium'), q('How would you implement user authentication and session management?','descriptive','hard'), q('Describe your approach to handling file uploads and cloud storage','descriptive','medium'), q('How do you ensure code quality and maintainability across the stack?','descriptive','medium'), q('What is your experience with deployment and DevOps practices?','descriptive','medium'), q('How do you handle testing across frontend and backend?','descriptive','hard'), q('Describe your approach to monitoring and debugging production issues','descriptive','hard') ],
    'devops':          [ q('Explain containerization and the benefits of Docker','descriptive','easy'), q('How would you design a CI/CD pipeline from scratch?','descriptive','hard'), q('What monitoring and logging strategies do you use in production?','descriptive','medium'), q('Describe your approach to infrastructure as code using Terraform or Ansible','descriptive','medium'), q('How do you handle disaster recovery and backup strategies?','descriptive','hard'), q('What is Kubernetes and how does it manage containerized applications?','descriptive','hard'), q('How would you implement auto-scaling for a high-traffic application?','descriptive','hard'), q('Describe your approach to security in cloud infrastructure','descriptive','medium'), q('How do you manage secrets and sensitive data in production?','descriptive','medium'), q('What is your experience with AWS, Azure, or GCP?','descriptive','medium'), q('How do you optimize cloud infrastructure costs?','descriptive','medium'), q('Describe your approach to load balancing and traffic management','descriptive','hard') ],
    'data-science':    [ q('Explain the difference between supervised and unsupervised learning','descriptive','easy'), q('How do you handle missing data in a dataset?','descriptive','medium'), q('Describe your approach to feature engineering and selection','descriptive','medium'), q('What metrics do you use to evaluate classification vs regression models?','short_answer','medium'), q('How would you approach a complex machine learning problem end-to-end?','descriptive','hard'), q('Explain the bias-variance tradeoff in machine learning','descriptive','hard'), q('How do you prevent overfitting in machine learning models?','descriptive','medium'), q('Describe your experience with TensorFlow or PyTorch','descriptive','hard'), q('How would you handle imbalanced datasets?','descriptive','medium'), q('What is your approach to model deployment and monitoring?','descriptive','medium'), q('How do you perform exploratory data analysis on a new dataset?','descriptive','medium'), q('Describe your experience with data visualization tools','descriptive','medium') ],
    'ai-ml':           [ q('Explain the difference between a neural network and a traditional ML algorithm','descriptive','easy'), q('How do you choose between different ML algorithms for a given problem?','descriptive','medium'), q('Describe the architecture of a transformer model and its key components','descriptive','hard'), q('What is transfer learning and when would you use it?','descriptive','medium'), q('How do you evaluate and compare different ML models?','descriptive','medium'), q('Explain gradient descent and its variants (SGD, Adam, RMSProp)','descriptive','hard'), q('How do you handle overfitting in deep learning models?','descriptive','medium'), q('What is your experience with MLOps and model deployment pipelines?','descriptive','hard'), q('Describe how you would build a recommendation system','descriptive','hard'), q('What are embeddings and how are they used in NLP and recommendation systems?','descriptive','medium'), q('How do you approach hyperparameter tuning?','descriptive','medium'), q('Explain the concept of attention mechanism in deep learning','descriptive','hard') ],
    'computer-vision': [ q('Explain how a Convolutional Neural Network (CNN) works','descriptive','easy'), q('What is the difference between object detection and image segmentation?','short_answer','medium'), q('Describe the YOLO architecture and its advantages for real-time detection','descriptive','hard'), q('How do you handle class imbalance in image classification datasets?','descriptive','medium'), q('What data augmentation techniques do you use for image datasets?','descriptive','medium'), q('Explain the concept of transfer learning in computer vision','descriptive','medium'), q('How would you build a real-time object detection system?','descriptive','hard'), q('What is the role of anchor boxes in object detection models?','descriptive','hard'), q('Describe your experience with OpenCV and image preprocessing','descriptive','medium'), q('How do you evaluate the performance of a computer vision model?','descriptive','medium'), q('What is semantic segmentation vs instance segmentation?','descriptive','hard'), q('How would you deploy a computer vision model on edge devices?','descriptive','hard') ],
    'nlp':             [ q('Explain the difference between stemming and lemmatization','short_answer','easy'), q('What is TF-IDF and how is it used in text analysis?','descriptive','medium'), q('Describe the architecture of BERT and how it differs from GPT','descriptive','hard'), q('How do you handle out-of-vocabulary words in NLP models?','descriptive','medium'), q('What is named entity recognition and how would you build an NER system?','descriptive','medium'), q('Explain the concept of word embeddings (Word2Vec, GloVe, FastText)','descriptive','medium'), q('How would you build a text classification pipeline?','descriptive','medium'), q('What is the attention mechanism and why is it important in NLP?','descriptive','hard'), q('How do you evaluate the quality of a language model?','descriptive','medium'), q('Describe your approach to fine-tuning a pre-trained language model','descriptive','hard'), q('What are the challenges of multilingual NLP?','descriptive','hard'), q('How would you build a question-answering system?','descriptive','hard') ],
    'cybersecurity':   [ q('Explain the difference between symmetric and asymmetric encryption','descriptive','easy'), q('What is the OWASP Top 10 and why is it important?','short_answer','medium'), q('Describe how SQL injection attacks work and how to prevent them','descriptive','medium'), q('What is a man-in-the-middle attack and how do you defend against it?','descriptive','medium'), q('Explain the concept of zero-trust security architecture','descriptive','hard'), q('How do you perform a penetration test on a web application?','descriptive','hard'), q('What is the difference between IDS and IPS systems?','short_answer','medium'), q('Describe your approach to incident response when a breach is detected','descriptive','hard'), q('What is cross-site scripting (XSS) and how do you prevent it?','descriptive','medium'), q('How do you implement secure authentication and session management?','descriptive','medium'), q('Explain the concept of threat modeling','descriptive','hard'), q('What tools do you use for vulnerability scanning and security auditing?','descriptive','medium') ],
    'cloud':           [ q('Explain the difference between IaaS, PaaS, and SaaS','descriptive','easy'), q('How would you design a highly available and fault-tolerant cloud architecture?','descriptive','hard'), q('What is the difference between horizontal and vertical scaling?','short_answer','easy'), q('Describe your experience with AWS services (EC2, S3, RDS, Lambda)','descriptive','medium'), q('How do you implement a serverless architecture?','descriptive','medium'), q('What is a VPC and how do you configure network security in the cloud?','descriptive','medium'), q('How do you manage cloud costs and optimize resource utilization?','descriptive','medium'), q('Describe your approach to cloud security and compliance','descriptive','hard'), q('What is a CDN and when would you use one?','short_answer','easy'), q('How do you implement disaster recovery in a cloud environment?','descriptive','hard'), q('Explain the concept of cloud-native application design','descriptive','hard'), q('How do you monitor and observe cloud infrastructure?','descriptive','medium') ],
    'testing':         [ q('Explain the difference between unit, integration, and end-to-end testing','descriptive','easy'), q('What is the test pyramid and how does it guide your testing strategy?','descriptive','medium'), q('How do you write effective unit tests for complex business logic?','descriptive','medium'), q('Describe your experience with test automation frameworks','descriptive','medium'), q('What is mocking and when should you use it in tests?','descriptive','medium'), q('How do you approach testing a REST API?','descriptive','medium'), q('What is regression testing and how do you manage it?','descriptive','easy'), q('Describe your approach to performance and load testing','descriptive','hard'), q('How do you measure and improve test coverage?','descriptive','medium'), q('What is behavior-driven development (BDD) and how does it work?','descriptive','medium'), q('How do you handle flaky tests in a CI/CD pipeline?','descriptive','hard'), q('Describe your experience with Selenium, Cypress, or Playwright','descriptive','medium') ],
    'sdet':            [ q('What is the difference between a QA Engineer and an SDET?','short_answer','easy'), q('How do you design a test automation framework from scratch?','descriptive','hard'), q('Describe your experience with Selenium WebDriver and Page Object Model','descriptive','medium'), q('How do you integrate automated tests into a CI/CD pipeline?','descriptive','hard'), q('What is API testing and how do you automate it?','descriptive','medium'), q('How do you handle dynamic elements and waits in UI automation?','descriptive','medium'), q('Describe your approach to performance testing with JMeter or Gatling','descriptive','hard'), q('How do you prioritize which test cases to automate?','descriptive','medium'), q('What is contract testing and when would you use it?','descriptive','hard'), q('How do you debug and maintain a large test automation suite?','descriptive','medium'), q('Describe your experience with mobile test automation (Appium)','descriptive','medium'), q('How do you report and track test results and defects?','descriptive','easy') ],
    'game-dev':        [ q('Explain the game loop and how it manages update and render cycles','descriptive','easy'), q('What is the difference between component-based and inheritance-based game architecture?','descriptive','medium'), q('How do you optimize game performance for low-end devices?','descriptive','hard'), q('Describe your experience with Unity or Unreal Engine','descriptive','medium'), q('What is a physics engine and how does collision detection work?','descriptive','medium'), q('How do you implement pathfinding algorithms like A* in a game?','coding','hard'), q('What is the difference between 2D and 3D rendering pipelines?','descriptive','medium'), q('How do you handle game state management and save systems?','descriptive','medium'), q('Describe your approach to multiplayer networking in games','descriptive','hard'), q('What is shader programming and when would you write custom shaders?','descriptive','hard'), q('How do you implement an animation state machine?','descriptive','medium'), q('What are the common causes of memory leaks in game development?','descriptive','hard') ],
    'mobile':          [ q('Explain the difference between native, hybrid, and cross-platform mobile development','descriptive','easy'), q('How do you manage state in a React Native or Flutter application?','descriptive','medium'), q('What are the key differences between iOS and Android development?','descriptive','medium'), q('How do you optimize mobile app performance and reduce battery usage?','descriptive','hard'), q('Describe your approach to handling offline functionality in mobile apps','descriptive','hard'), q('What is the mobile app lifecycle and how do you handle background tasks?','descriptive','medium'), q('How do you implement push notifications in a mobile application?','descriptive','medium'), q('Describe your experience with mobile app security best practices','descriptive','hard'), q('How do you handle different screen sizes and orientations?','descriptive','medium'), q('What is your approach to mobile app testing and debugging?','descriptive','medium'), q('How do you publish an app to the App Store and Google Play?','descriptive','easy'), q('Describe your experience with mobile CI/CD pipelines','descriptive','hard') ],
    'system-design':   [ q('How would you design a URL shortening service like bit.ly?','descriptive','medium'), q('Explain the CAP theorem and its implications for distributed systems','descriptive','hard'), q('How would you design a distributed cache system?','descriptive','hard'), q('What is consistent hashing and when is it used?','descriptive','hard'), q('How would you design a real-time chat application at scale?','descriptive','hard'), q('Explain the difference between SQL and NoSQL and when to choose each','descriptive','medium'), q('How would you design a notification system for millions of users?','descriptive','hard'), q('What is a message queue and how does it improve system reliability?','descriptive','medium'), q('How do you design for high availability and fault tolerance?','descriptive','hard'), q('Explain database sharding and its trade-offs','descriptive','hard'), q('How would you design a rate limiter?','descriptive','medium'), q('What is event-driven architecture and when would you use it?','descriptive','medium') ],
    'embedded':        [ q('Explain the difference between microcontrollers and microprocessors','short_answer','easy'), q('What is RTOS and when would you use it over a bare-metal approach?','descriptive','medium'), q('How do you handle interrupt service routines (ISRs) safely?','descriptive','medium'), q('Describe your experience with communication protocols (I2C, SPI, UART)','descriptive','medium'), q('How do you debug embedded systems without a traditional debugger?','descriptive','hard'), q('What is memory-mapped I/O and how does it work?','descriptive','medium'), q('How do you optimize code for memory-constrained embedded systems?','descriptive','hard'), q('Explain the concept of watchdog timers and their importance','descriptive','medium'), q('How do you implement power management in battery-powered devices?','descriptive','hard'), q('What is DMA and when would you use it?','short_answer','medium'), q('Describe your experience with bootloaders and firmware updates','descriptive','hard'), q('How do you ensure real-time performance in embedded systems?','descriptive','hard') ],
    'robotics':        [ q('Explain the difference between forward and inverse kinematics','descriptive','medium'), q('What is ROS (Robot Operating System) and how does it work?','descriptive','medium'), q('How do you implement PID control for a robotic system?','descriptive','hard'), q('Describe your experience with SLAM (Simultaneous Localization and Mapping)','descriptive','hard'), q('What is the difference between reactive and deliberative robot architectures?','descriptive','medium'), q('How do you handle sensor fusion from multiple sources (LiDAR, camera, IMU)?','descriptive','hard'), q('Explain the concept of motion planning algorithms (RRT, A*)','descriptive','hard'), q('How do you ensure safety in human-robot interaction?','descriptive','medium'), q('Describe your experience with robot simulation environments (Gazebo, Webots)','descriptive','medium'), q('What is a Kalman filter and how is it used in robotics?','descriptive','hard'), q('How do you test and validate robotic software?','descriptive','medium'), q('Describe the challenges of deploying robots in unstructured environments','descriptive','hard') ],
    'bi':              [ q('Explain the difference between OLTP and OLAP systems','descriptive','easy'), q('What is a data warehouse and how does it differ from a data lake?','descriptive','medium'), q('Describe your experience with BI tools like Power BI, Tableau, or Looker','descriptive','medium'), q('How do you design an effective dashboard for business stakeholders?','descriptive','medium'), q('What is a star schema and how does it differ from a snowflake schema?','descriptive','medium'), q('How do you ensure data quality and consistency in a BI pipeline?','descriptive','hard'), q('Describe your experience with ETL/ELT processes','descriptive','medium'), q('How do you optimize slow SQL queries in a data warehouse?','descriptive','hard'), q('What are KPIs and how do you define them with business stakeholders?','descriptive','medium'), q('How do you handle slowly changing dimensions (SCD) in a data warehouse?','descriptive','hard'), q('Describe your experience with dbt or similar data transformation tools','descriptive','medium'), q('How do you present complex data insights to non-technical audiences?','descriptive','medium') ],
    'blockchain':      [ q('Explain how blockchain achieves consensus without a central authority','descriptive','easy'), q('What is the difference between Proof of Work and Proof of Stake?','descriptive','medium'), q('How do smart contracts work and what are their limitations?','descriptive','medium'), q('Describe your experience with Solidity and Ethereum development','descriptive','medium'), q('What is a gas fee and how does it affect smart contract design?','descriptive','medium'), q('How do you test and audit smart contracts for security vulnerabilities?','descriptive','hard'), q('What is a reentrancy attack and how do you prevent it?','descriptive','hard'), q('Explain the concept of DeFi and how liquidity pools work','descriptive','hard'), q('How do you handle upgradeable smart contracts?','descriptive','hard'), q('What is IPFS and how is it used in decentralized applications?','descriptive','medium'), q('Describe the differences between Layer 1 and Layer 2 blockchain solutions','descriptive','hard'), q('How do you integrate a blockchain backend with a traditional web frontend?','descriptive','medium') ],
    'uiux':            [ q('Explain the difference between UX and UI design','short_answer','easy'), q('What is your design process from research to final deliverable?','descriptive','medium'), q('How do you conduct user research and usability testing?','descriptive','medium'), q('Describe your experience with Figma, Sketch, or Adobe XD','descriptive','medium'), q('What is a design system and why is it important?','descriptive','medium'), q('How do you design for accessibility (WCAG guidelines)?','descriptive','medium'), q('Explain the concept of information architecture and how you apply it','descriptive','medium'), q('How do you handle conflicting feedback from stakeholders and users?','descriptive','hard'), q('What is the difference between wireframes, mockups, and prototypes?','short_answer','easy'), q('How do you measure the success of a design after launch?','descriptive','medium'), q('Describe your approach to designing for mobile-first experiences','descriptive','medium'), q('How do you collaborate with developers to ensure design fidelity?','descriptive','medium') ],
  }

  const roleLower = jobRole.toLowerCase()
  const roleMap = [
    { keys: ['computer vision','cv engineer','vision engineer','opencv'],                  role: 'computer-vision' },
    { keys: ['nlp','natural language','text mining','language model'],                     role: 'nlp' },
    { keys: ['robotics','robot','ros ','autonomous vehicle','drone'],                      role: 'robotics' },
    { keys: ['ai engineer','ml engineer','machine learning engineer','deep learning'],     role: 'ai-ml' },
    { keys: ['cybersecurity','security analyst','penetration','infosec','soc'],            role: 'cybersecurity' },
    { keys: ['cloud engineer','cloud architect','aws engineer','azure engineer'],          role: 'cloud' },
    { keys: ['sdet','automation engineer','test engineer'],                                role: 'sdet' },
    { keys: ['software tester','quality assurance','manual tester','qa engineer'],        role: 'testing' },
    { keys: ['game developer','game dev','unity','unreal','gaming'],                       role: 'game-dev' },
    { keys: ['mobile','android','ios','react native','flutter','swift','kotlin'],          role: 'mobile' },
    { keys: ['system design','distributed systems','solutions architect'],                 role: 'system-design' },
    { keys: ['embedded','firmware','rtos','microcontroller','iot'],                        role: 'embedded' },
    { keys: ['business intelligence','bi developer','data analyst','tableau','power bi'],  role: 'bi' },
    { keys: ['blockchain','solidity','smart contract','web3','defi'],                      role: 'blockchain' },
    { keys: ['ui/ux','ux designer','ui designer','product designer','figma'],              role: 'uiux' },
    { keys: ['frontend','front-end','react','vue','angular','css','html'],                 role: 'frontend' },
    { keys: ['backend','back-end','node','django','spring','laravel','java'],              role: 'backend' },
    { keys: ['devops','kubernetes','docker','ci/cd','infrastructure'],                     role: 'devops' },
    { keys: ['data science','data engineer','pandas','spark','etl','ai','ml'],             role: 'data-science' },
    { keys: ['fullstack','full stack','full-stack','mern','mean'],                         role: 'fullstack' },
  ]

  let selectedRole = 'fullstack'
  for (const { keys, role } of roleMap) {
    if (keys.some(k => roleLower.includes(k))) { selectedRole = role; break }
  }

  const all = bank[selectedRole] || bank['fullstack']
  const selected = [...all].sort(() => Math.random() - 0.5).slice(0, 10)
  console.log(`Fallback: "${jobRole}" → "${selectedRole}" (${selected.length} questions)`)
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

    const result = await generateWithFallback(prompt)
    const responseText = result
    if (!responseText) return generateFallbackEvaluation(answer, question)

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
