import axios from 'axios'

/**
 * Job Search Service - Searches for jobs from the internet
 * Uses RapidAPI's JSearch API (free tier available)
 * 
 * Setup:
 * 1. Go to https://rapidapi.com/laimoon/api/jsearch
 * 2. Subscribe to the free plan
 * 3. Get your API key
 * 4. Add to .env: JSEARCH_API_KEY=your_api_key
 */

class JobSearchService {
  constructor() {
    this.apiKey = process.env.JSEARCH_API_KEY
    this.apiHost = 'jsearch.p.rapidapi.com'
    this.baseUrl = 'https://jsearch.p.rapidapi.com/search'
  }

  /**
   * Search for jobs based on skills and keywords
   * @param {Array} skills - Array of skills to search for
   * @param {String} location - Job location (optional)
   * @param {Number} limit - Number of results (default: 10)
   * @returns {Promise<Array>} - Array of job listings
   */
  async searchJobs(skills, location = 'remote', limit = 10) {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ JSEARCH_API_KEY not configured. Using mock data.')
        return this.getMockJobs(skills, limit)
      }

      // Create search query from skills
      const searchQuery = skills.slice(0, 3).join(' OR ')
      
      console.log('\n=== JOB SEARCH REQUEST ===')
      console.log('Search Query:', searchQuery)
      console.log('Location:', location)
      console.log('Limit:', limit)

      const options = {
        method: 'GET',
        url: this.baseUrl,
        params: {
          query: `${searchQuery} ${location}`,
          page: '1',
          num_pages: '1',
          date_posted: 'last_month'
        },
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost
        }
      }

      const response = await axios.request(options)
      
      if (response.data && response.data.data) {
        const jobs = response.data.data.slice(0, limit).map(job => ({
          jobId: job.job_id,
          jobTitle: job.job_title,
          jobDescription: job.job_description || 'No description available',
          company: job.employer_name,
          location: job.job_location || location,
          salary: job.job_salary_currency && job.job_salary_max 
            ? `${job.job_salary_currency} ${job.job_salary_min}-${job.job_salary_max}`
            : 'Not specified',
          jobUrl: job.job_apply_link,
          source: 'Internet',
          postedDate: job.job_posted_at_datetime_utc,
          jobType: job.job_employment_type || 'Full-time',
          requiredSkills: this.extractSkillsFromDescription(job.job_description || ''),
          isExternal: true
        }))

        console.log('Jobs Found:', jobs.length)
        console.log('=== JOB SEARCH END ===\n')

        return jobs
      }

      return []
    } catch (error) {
      console.error('Error searching jobs:', error.message)
      console.log('Falling back to mock data...')
      return this.getMockJobs(skills, limit)
    }
  }

  /**
   * Extract skills from job description
   */
  extractSkillsFromDescription(description) {
    const skillKeywords = [
      'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
      'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask',
      'sql', 'mysql', 'mongodb', 'postgresql', 'redis',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'git', 'github', 'gitlab', 'jenkins', 'ci/cd',
      'html', 'css', 'typescript', 'rest', 'graphql',
      'machine learning', 'ai', 'data science', 'analytics'
    ]

    const skills = []
    const descLower = description.toLowerCase()

    for (const skill of skillKeywords) {
      if (descLower.includes(skill)) {
        skills.push(skill)
      }
    }

    return [...new Set(skills)] // Remove duplicates
  }

  /**
   * Mock job data for testing (when API key not configured)
   */
  getMockJobs(skills, limit) {
    const mockJobs = [
      {
        jobId: 'mock-1',
        jobTitle: 'Senior Python Developer',
        jobDescription: 'We are looking for an experienced Python developer with expertise in Django and REST APIs. Must have 5+ years of experience.',
        company: 'Tech Startup Inc',
        location: 'Remote',
        salary: 'USD 100,000-150,000',
        jobUrl: 'https://example.com/job/1',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['python', 'django', 'rest', 'sql', 'git'],
        isExternal: true
      },
      {
        jobId: 'mock-2',
        jobTitle: 'Full Stack JavaScript Developer',
        jobDescription: 'Join our team as a Full Stack Developer. We use React, Node.js, and MongoDB. Experience with TypeScript is a plus.',
        company: 'Digital Solutions Ltd',
        location: 'Remote',
        salary: 'USD 80,000-120,000',
        jobUrl: 'https://example.com/job/2',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['javascript', 'react', 'node.js', 'mongodb', 'typescript'],
        isExternal: true
      },
      {
        jobId: 'mock-3',
        jobTitle: 'Data Scientist',
        jobDescription: 'Looking for a Data Scientist with expertise in Python, Machine Learning, and SQL. Work with large datasets and build predictive models.',
        company: 'Analytics Pro',
        location: 'Remote',
        salary: 'USD 90,000-140,000',
        jobUrl: 'https://example.com/job/3',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['python', 'machine learning', 'sql', 'analytics', 'git'],
        isExternal: true
      },
      {
        jobId: 'mock-4',
        jobTitle: 'DevOps Engineer',
        jobDescription: 'We need a DevOps Engineer with experience in Docker, Kubernetes, AWS, and CI/CD pipelines. Linux knowledge required.',
        company: 'Cloud Systems',
        location: 'Remote',
        salary: 'USD 110,000-160,000',
        jobUrl: 'https://example.com/job/4',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'git'],
        isExternal: true
      },
      {
        jobId: 'mock-5',
        jobTitle: 'Frontend React Developer',
        jobDescription: 'Seeking a React Developer with strong CSS and JavaScript skills. Experience with Redux and REST APIs required.',
        company: 'Web Innovations',
        location: 'Remote',
        salary: 'USD 75,000-110,000',
        jobUrl: 'https://example.com/job/5',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['react', 'javascript', 'css', 'html', 'rest'],
        isExternal: true
      },
      {
        jobId: 'mock-6',
        jobTitle: 'Java Backend Developer',
        jobDescription: 'Looking for a Java developer with Spring Boot experience. Must have knowledge of microservices and REST APIs.',
        company: 'Enterprise Solutions',
        location: 'Remote',
        salary: 'USD 95,000-135,000',
        jobUrl: 'https://example.com/job/6',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['java', 'spring', 'rest', 'sql', 'git'],
        isExternal: true
      },
      {
        jobId: 'mock-7',
        jobTitle: 'AI/ML Engineer',
        jobDescription: 'Join our AI team! We need engineers with Python, TensorFlow, and Machine Learning expertise. PhD preferred but not required.',
        company: 'AI Innovations',
        location: 'Remote',
        salary: 'USD 120,000-180,000',
        jobUrl: 'https://example.com/job/7',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['python', 'machine learning', 'ai', 'tensorflow', 'analytics'],
        isExternal: true
      },
      {
        jobId: 'mock-8',
        jobTitle: 'Database Administrator',
        jobDescription: 'Experienced DBA needed for managing MySQL, PostgreSQL, and MongoDB databases. Must have 7+ years experience.',
        company: 'Data Management Corp',
        location: 'Remote',
        salary: 'USD 85,000-125,000',
        jobUrl: 'https://example.com/job/8',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['sql', 'mysql', 'postgresql', 'mongodb', 'git'],
        isExternal: true
      },
      {
        jobId: 'mock-9',
        jobTitle: 'Cloud Architect',
        jobDescription: 'We are seeking a Cloud Architect with AWS and Azure expertise. Design and implement scalable cloud solutions.',
        company: 'Cloud Experts',
        location: 'Remote',
        salary: 'USD 130,000-180,000',
        jobUrl: 'https://example.com/job/9',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd'],
        isExternal: true
      },
      {
        jobId: 'mock-10',
        jobTitle: 'QA Automation Engineer',
        jobDescription: 'Looking for QA Automation Engineer with Selenium, Python, and CI/CD experience. Test automation expertise required.',
        company: 'Quality Assurance Plus',
        location: 'Remote',
        salary: 'USD 70,000-100,000',
        jobUrl: 'https://example.com/job/10',
        source: 'Internet (Mock)',
        postedDate: new Date().toISOString(),
        jobType: 'Full-time',
        requiredSkills: ['python', 'ci/cd', 'git', 'sql', 'rest'],
        isExternal: true
      }
    ]

    return mockJobs.slice(0, limit)
  }
}

export default new JobSearchService()
