import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RadarChart from '../components/RadarChart'
import ThemeToggle from '../components/ThemeToggle'

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('jobs')
  const [candidateData, setCandidateData] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSkill, setFilterSkill] = useState('')
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [availability, setAvailability] = useState('immediate')
  const [noticePeriod, setNoticePeriod] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [showBestJobs, setShowBestJobs] = useState(false)
  const [bestJobs, setBestJobs] = useState([])
  const [pendingInterviews, setPendingInterviews] = useState([])
  const [completedInterviews, setCompletedInterviews] = useState([])
  const [savedProfile, setSavedProfile] = useState(null)

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (!token) {
      navigate('/candidate-login')
      return
    }

    // Auto-redirect on expired/invalid token
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          localStorage.clear()
          navigate('/candidate-login')
        }
        return Promise.reject(err)
      }
    )

    fetchCandidateData()
    fetchJobs()
    fetchApplications()
    fetchAIInterviews()
    // Load saved profile for apply-without-upload feature
    axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data.skills?.length > 0) setSavedProfile(r.data) })
      .catch(() => {})

    return () => axios.interceptors.response.eject(interceptor)
  }, [token, navigate])

  const fetchCandidateData = async () => {
    try {
      const response = await axios.get(`/api/candidates/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCandidateData(response.data)
    } catch (error) {
      console.error('Failed to fetch candidate data:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/api/candidates/applications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApplications(response.data)
      const applied = new Set(response.data.map(app => app.jobId?._id || app.jobId))
      setAppliedJobs(applied)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      setLoading(false)
    }
  }

  const fetchAIInterviews = async () => {
    try {
      const response = await axios.get('/api/ai-interview/candidate/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPendingInterviews(response.data.pending || [])
      setCompletedInterviews(response.data.completed || [])
    } catch (error) {
      console.error('Failed to fetch AI interviews:', error)
    }
  }

  const handleApplyClick = (job) => {
    setSelectedJobForApplication(job)
    setShowApplicationForm(true)
    setAnalysisResult(null)
    setResumeFile(null)
  }

  // Real-time resume analysis
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResumeFile(file)
    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobId', selectedJobForApplication._id)

      const response = await axios.post('/api/analysis/analyze-resume-for-job', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setAnalysisResult(response.data)
    } catch (error) {
      const status = error.response?.status
      if (status === 401) {
        alert('Your session has expired. Please log in again.')
        localStorage.clear()
        navigate('/candidate-login')
      } else {
        console.error('Failed to analyze resume:', error)
        alert('Failed to analyze resume: ' + (error.response?.data?.error || error.message))
      }
    } finally {
      setAnalyzing(false)
    }
  }

  // Find best matching jobs for resume
  const handleFindBestJobs = async () => {
    if (!resumeFile) {
      alert('Please upload a resume first')
      return
    }

    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)

      const response = await axios.post('/api/analysis/find-best-jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setBestJobs(response.data.topJobs)
      setShowBestJobs(true)
    } catch (error) {
      console.error('Failed to find best jobs:', error)
      alert('Failed to find matching jobs')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()

    if (!resumeFile && !savedProfile) {
      alert('Please upload a resume or complete your profile')
      return
    }

    if (!analysisResult || analysisResult.matchScore < 60) {
      alert('Match score must be at least 60% to apply')
      return
    }

    if (availability === 'notice_period' && !noticePeriod) {
      alert('Please specify notice period')
      return
    }

    try {
      const formData = new FormData()
      formData.append('jobId', selectedJobForApplication._id)
      formData.append('resume', resumeFile)
      formData.append('availability', availability)
      if (availability === 'notice_period') {
        formData.append('noticePeriod', noticePeriod)
      }

      await axios.post('/api/candidates/apply', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      alert('Applied successfully!')
      setAppliedJobs(new Set([...appliedJobs, selectedJobForApplication._id]))
      setShowApplicationForm(false)
      setResumeFile(null)
      setAvailability('immediate')
      setNoticePeriod('')
      setAnalysisResult(null)
      fetchApplications()
    } catch (error) {
      alert('Failed to apply: ' + error.response?.data?.error)
    }
  }

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/candidates/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('Application deleted successfully')
        fetchApplications()
      } catch (error) {
        alert('Failed to delete application: ' + error.response?.data?.error)
      }
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = !filterSkill || job.requiredSkills.some(skill =>
      skill.toLowerCase().includes(filterSkill.toLowerCase())
    )
    return matchesSearch && matchesSkill
  })

  const getStatusColor = (status) => {
    const colors = {
      applied:    'bg-slate-700 text-slate-300',
      screening:  'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      interviewed:'bg-violet-500/20 text-violet-300 border border-violet-500/30',
      rejected:   'bg-red-500/20 text-red-300 border border-red-500/30',
      hired:      'bg-green-500/20 text-green-300 border border-green-500/30'
    }
    return colors[status] || 'bg-slate-700 text-slate-300'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 70) return 'text-blue-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              HireLens
            </h1>
            <p className="text-gray-400 text-sm">Candidate Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
              <p className="text-gray-400 text-sm">Email: {localStorage.getItem('email')}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Applications</p>
              <p className="text-3xl font-bold text-blue-400">{applications.length}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="group flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl transition text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl group-hover:bg-blue-500/30 transition">👤</div>
            <div>
              <p className="text-white font-semibold text-sm">My Profile</p>
              <p className="text-slate-400 text-xs">Build persistent profile</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-blue-400 transition">→</span>
          </button>
          <button
            onClick={() => navigate('/job-recommendations')}
            className="group flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 hover:border-violet-500/50 rounded-xl transition text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-xl group-hover:bg-violet-500/30 transition">🔍</div>
            <div>
              <p className="text-white font-semibold text-sm">Job Recommendations</p>
              <p className="text-slate-400 text-xs">AI-matched jobs for you</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-violet-400 transition">→</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'jobs'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'applications'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'interviews'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            AI Interviews
          </button>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {/* Search and Filter */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Filter by skill..."
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div key={job._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{job.description}</p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills?.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">📍 {job.location || 'Remote'}</p>
                      {job.salary && <p className="text-gray-400 text-sm">💰 {job.salary}</p>}
                    </div>

                    <button
                      onClick={() => handleApplyClick(job)}
                      disabled={appliedJobs.has(job._id)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                        appliedJobs.has(job._id)
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {appliedJobs.has(job._id) ? 'Already Applied' : 'Apply Now'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-400">No jobs found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{app.jobId?.title || 'Job'}</h3>
                        <p className="text-gray-400 text-sm mt-1">{app.jobId?.description?.substring(0, 100)}...</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <button
                          onClick={() => handleDeleteApplication(app._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500 rounded-full text-sm hover:bg-red-500/30 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Status Pipeline */}
                    <div className="mb-5">
                      <div className="flex items-center gap-0">
                        {['applied', 'screening', 'interviewed', 'hired'].map((stage, i, arr) => {
                          const stages = ['applied', 'screening', 'interviewed', 'hired', 'rejected']
                          const currentIdx = stages.indexOf(app.status)
                          const stageIdx = ['applied', 'screening', 'interviewed', 'hired'].indexOf(stage)
                          const isRejected = app.status === 'rejected'
                          const isDone = isRejected ? false : currentIdx >= stages.indexOf(stage)
                          const isCurrent = app.status === stage
                          const stageIcons = { applied: '📝', screening: '🔍', interviewed: '🤖', hired: '✅' }
                          return (
                            <div key={stage} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isRejected && stage === 'interviewed' ? 'bg-red-500/20 border-2 border-red-500 text-red-400' :
                                  isCurrent ? 'bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]' :
                                  isDone ? 'bg-green-500/20 border-2 border-green-500 text-green-400' :
                                  'bg-slate-700 border-2 border-slate-600 text-slate-500'
                                }`}>
                                  {stageIcons[stage]}
                                </div>
                                <span className={`text-xs mt-1 font-medium capitalize ${
                                  isCurrent ? 'text-blue-400' : isDone ? 'text-green-400' : 'text-slate-500'
                                }`}>{stage}</span>
                              </div>
                              {i < arr.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 mb-4 ${
                                  isDone && !isCurrent ? 'bg-green-500/50' : 'bg-slate-700'
                                }`} />
                              )}
                            </div>
                          )
                        })}
                        {app.status === 'rejected' && (
                          <div className="flex flex-col items-center ml-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-red-500/20 border-2 border-red-500 text-red-400">❌</div>
                            <span className="text-xs mt-1 font-medium text-red-400">Rejected</span>
                          </div>
                        )}
                      </div>
                      {app.statusNote && (
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <span>🤖</span> {app.statusNote}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Match Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(app.matchScore)}`}>{app.matchScore || 0}%</p>
                      </div>
                      {app.interviewScore != null && (
                        <div>
                          <p className="text-gray-500 text-sm">Interview Score</p>
                          <p className={`text-2xl font-bold ${getScoreColor(app.interviewScore)}`}>{app.interviewScore}%</p>
                        </div>
                      )}
                      {app.combinedScore != null && app.interviewScore != null && (
                        <div>
                          <p className="text-gray-500 text-sm">Combined Score</p>
                          <p className={`text-2xl font-bold ${getScoreColor(app.combinedScore)}`}>{app.combinedScore}%</p>
                          <p className="text-xs text-gray-400 mt-1">40% Resume + 60% Interview</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 text-sm">Applied On</p>
                        <p className="text-white">{new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Radar chart — only when AI sub-scores exist */}
                    {app.matchSource === 'ai' && (app.skillMatchScore > 0 || app.experienceMatch > 0) && (
                      <div className="bg-slate-700/40 rounded-xl p-4 mb-4 border border-slate-600/40">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1">
                          <span>🤖</span> AI Score Breakdown
                        </p>
                        <RadarChart
                          scores={{
                            matchScore: app.matchScore,
                            skillMatchScore: app.skillMatchScore,
                            experienceMatch: app.experienceMatch,
                            educationMatch: app.educationMatch,
                            projectRelevance: app.projectRelevance,
                          }}
                          size={200}
                        />
                      </div>
                    )}

                    {app.feedback && (
                      <div className="bg-slate-700/50 rounded p-3 mb-4">
                        <p className="text-gray-400 text-sm">Feedback</p>
                        <p className="text-gray-300">{app.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">You haven't applied to any jobs yet</p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="space-y-8">
            {/* Pending Interviews */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Pending Interviews</h3>
              {pendingInterviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {pendingInterviews.map(interview => (
                    <div key={interview._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">{interview.jobId?.title}</h4>
                          <p className="text-gray-400 text-sm">From: {interview.recruiterId?.name}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Expires: {new Date(interview.expiresAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => navigate(`/interview/${interview.interviewToken}`)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
                      >
                        Start Interview
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No pending interviews</p>
                </div>
              )}
            </div>

            {/* Completed Interviews */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Completed Interviews</h3>
              {completedInterviews.length > 0 ? (
                <div className="space-y-4">
                  {completedInterviews.map(interview => (
                    <div key={interview._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{interview.jobId?.title}</h4>
                          <p className="text-gray-400 text-sm">From: {interview.recruiterId?.name}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">Score</p>
                          <p className="text-2xl font-bold text-green-400">{interview.score}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Correct Answers</p>
                          <p className="text-white font-semibold">{interview.correctAnswers}/{interview.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Completed On</p>
                          <p className="text-white text-sm">{new Date(interview.completedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {interview.feedback && (
                        <div className="bg-slate-700/50 rounded p-3 mt-4">
                          <p className="text-gray-400 text-sm mb-1">Feedback</p>
                          <p className="text-gray-300">{interview.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No completed interviews</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Application Form Modal with Real-time Analysis */}
      {showApplicationForm && selectedJobForApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Apply for {selectedJobForApplication.title}</h2>
              <button
                onClick={() => {
                  setShowApplicationForm(false)
                  setResumeFile(null)
                  setAvailability('immediate')
                  setNoticePeriod('')
                  setAnalysisResult(null)
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              {/* Resume Upload */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Upload Resume *</label>

                {/* Use saved profile option */}
                {savedProfile && (
                  <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">👤</span>
                      <div>
                        <p className="text-blue-300 text-sm font-semibold">Saved Profile Available</p>
                        <p className="text-slate-400 text-xs">{savedProfile.skills?.length} skills · {savedProfile.experience?.length} positions</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setAnalyzing(true)
                        try {
                          const r = await axios.post(`/api/profile/match-job/${selectedJobForApplication._id}`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                          setAnalysisResult(r.data)
                          setResumeFile(null) // signal: use profile
                        } catch (e) {
                          alert('Failed to analyze: ' + (e.response?.data?.error || e.message))
                        } finally {
                          setAnalyzing(false)
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg font-semibold transition"
                    >
                      Use Profile
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleResumeUpload}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {resumeFile && <p className="text-gray-400 text-sm mt-1">Selected: {resumeFile.name}</p>}
                {!resumeFile && analysisResult && savedProfile && (
                  <p className="text-blue-400 text-xs mt-1">✓ Using saved profile</p>
                )}
              </div>

              {/* Analysis Results */}
              {analyzing && (
                <div className="bg-slate-700 p-4 rounded-lg flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-400 flex-shrink-0"></div>
                  <div>
                    <p className="text-white text-sm font-medium">AI is analyzing your resume...</p>
                    <p className="text-gray-400 text-xs mt-0.5">Gemini is parsing skills, experience, and matching against the job</p>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="bg-slate-700 p-4 rounded-lg space-y-4">

                  {/* AI badge */}
                  {analysisResult.source === 'ai' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/15 border border-violet-500/30 rounded-lg w-fit">
                      <span className="text-sm">🤖</span>
                      <span className="text-violet-300 text-xs font-semibold">AI-Powered Analysis</span>
                    </div>
                  )}

                  {/* Overall match score */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-400 text-sm">Overall Match</p>
                      <p className={`text-lg font-bold ${getScoreColor(analysisResult.matchScore)}`}>
                        {analysisResult.matchScore}%
                      </p>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${
                          analysisResult.matchScore >= 70 ? 'bg-green-500' : analysisResult.matchScore >= 60 ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysisResult.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-scores (AI only) */}
                  {analysisResult.source === 'ai' && (
                    <>
                      {/* Radar chart */}
                      <div className="flex justify-center py-2">
                        <RadarChart scores={analysisResult} size={200} />
                      </div>

                      {/* Sub-score bars */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Skills',     value: analysisResult.skillMatchScore },
                          { label: 'Experience', value: analysisResult.experienceMatch },
                          { label: 'Education',  value: analysisResult.educationMatch },
                          { label: 'Projects',   value: analysisResult.projectRelevance },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-slate-600/60 rounded-lg p-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">{label}</span>
                              <span className={`font-bold ${getScoreColor(value)}`}>{value}%</span>
                            </div>
                            <div className="w-full bg-slate-500 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full ${value >= 70 ? 'bg-green-500' : value >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* AI overall assessment */}
                  {analysisResult.overallAssessment && (
                    <div className="bg-slate-600/50 rounded-lg p-3 border-l-2 border-blue-500">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">AI Assessment</p>
                      <p className="text-gray-200 text-sm leading-relaxed">{analysisResult.overallAssessment}</p>
                    </div>
                  )}

                  {/* Strengths */}
                  {analysisResult.strengths?.length > 0 && (
                    <div>
                      <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {analysisResult.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-green-400 mt-0.5">✓</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Matched Skills */}
                  {analysisResult.matchedSkills?.length > 0 && (
                    <div>
                      <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        Matched Skills ({analysisResult.matchedSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.matchedSkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skill Gaps */}
                  {analysisResult.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        Skill Gaps ({analysisResult.missingSkills.length})
                      </p>
                      <div className="space-y-2">
                        {analysisResult.skillGapSuggestions.map((gap, idx) => (
                          <div key={idx} className="bg-slate-600/60 p-2.5 rounded-lg text-sm border border-red-500/10">
                            <p className="text-red-300 font-semibold text-xs">{gap.skill}</p>
                            <p className="text-gray-300 text-xs mt-0.5">{gap.suggestion}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{gap.resources}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Concerns */}
                  {analysisResult.concerns?.length > 0 && (
                    <div>
                      <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">Areas to Address</p>
                      <ul className="space-y-1">
                        {analysisResult.concerns.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-yellow-400 mt-0.5">⚠</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Score gate */}
                  {analysisResult.matchScore < 60 ? (
                    <div className="bg-red-500/15 border border-red-500/30 p-3 rounded-lg">
                      <p className="text-red-300 font-semibold text-sm">Score Below 60% — Cannot Apply</p>
                      <p className="text-red-200 text-xs mt-1">Improve the skills listed above to qualify for this role.</p>
                      <button
                        type="button"
                        onClick={handleFindBestJobs}
                        disabled={analyzing}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                      >
                        {analyzing ? 'Finding jobs...' : 'Find Better Matching Jobs'}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-500/15 border border-green-500/30 p-3 rounded-lg">
                      <p className="text-green-300 font-semibold text-sm">✓ Great Match — Ready to Apply</p>
                      <p className="text-green-200 text-xs mt-1">Your profile aligns well with this role.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Availability */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Availability *</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Immediate Joining</option>
                  <option value="notice_period">Currently on Notice Period</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Notice Period */}
              {availability === 'notice_period' && (
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Notice Period *</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 weeks, 1 month"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowApplicationForm(false)
                    setResumeFile(null)
                    setAvailability('immediate')
                    setNoticePeriod('')
                    setAnalysisResult(null)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!analysisResult || analysisResult.matchScore < 60 || analyzing}
                  className={`flex-1 px-4 py-2 rounded-lg transition font-semibold ${
                    analysisResult && analysisResult.matchScore >= 60
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!analysisResult ? 'Upload Resume First' : analysisResult.matchScore >= 60 ? 'Submit Application' : 'Score Below 60%'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Best Jobs Modal */}
      {showBestJobs && bestJobs.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Best Matching Jobs</h2>
              <button
                onClick={() => setShowBestJobs(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {bestJobs.length > 0 ? (
              <div className="space-y-3">
                {bestJobs.map((job, idx) => (
                  <div key={idx} className="bg-slate-700 border border-slate-600 hover:border-blue-500 p-4 rounded-lg transition">
                    <p className="text-lg font-semibold text-white">{job.jobTitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No matching jobs found</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-600">
              <button
                onClick={() => setShowBestJobs(false)}
                className="w-full px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
