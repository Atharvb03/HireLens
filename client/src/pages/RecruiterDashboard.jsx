import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [sendingInterview, setSendingInterview] = useState(false)
  const [aiInterviewRankings, setAIInterviewRankings] = useState([])
  const [generatedInterviewLink, setGeneratedInterviewLink] = useState(null)

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    experience: '',
    salary: '',
    location: '',
    vacancies: 1
  })

  useEffect(() => {
    if (!token) {
      navigate('/admin-login')
      return
    }
    fetchJobs()
    fetchCandidates()
  }, [token, navigate])

  useEffect(() => {
    // Fetch rankings when candidates tab is active
    if (activeTab === 'candidates' && jobs.length > 0) {
      // Fetch rankings for the first job (or you could make it dynamic)
      jobs.forEach(job => {
        fetchAIInterviewRankings(job._id)
      })
    }
  }, [activeTab, jobs])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobs(response.data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('/api/candidates/applications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Sort by match score descending
      const sorted = response.data.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      setCandidates(sorted)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
      setLoading(false)
    }
  }

  const handleJobFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePostJob = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/jobs', {
        ...formData,
        vacancies: parseInt(formData.vacancies),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Job posted successfully!')
      setFormData({ title: '', description: '', requiredSkills: '', experience: '', salary: '', location: '', vacancies: 1 })
      setShowJobForm(false)
      fetchJobs()
    } catch (error) {
      alert('Failed to post job: ' + error.response?.data?.error)
    }
  }

  const handleSendAIInterview = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate')
      return
    }

    setSendingInterview(true)
    try {
      const response = await axios.post('/api/ai-interview/send-link', {
        candidateId: selectedCandidate.userId._id,
        jobId: selectedCandidate.jobId._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Display the interview link to recruiter
      setGeneratedInterviewLink(response.data.interview.interviewLink)
      alert(`Interview link generated! Share it with ${selectedCandidate.userId.name}`)
      console.log('Interview link:', response.data.interview.interviewLink)
      
      // Fetch rankings after generating interview
      fetchAIInterviewRankings(selectedCandidate.jobId._id)
    } catch (error) {
      alert('Failed to generate interview link: ' + error.response?.data?.error)
    } finally {
      setSendingInterview(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Job deleted successfully!')
      fetchJobs()
    } catch (error) {
      alert('Failed to delete job: ' + error.response?.data?.error)
    }
  }

  const fetchAIInterviewRankings = async (jobId) => {
    try {
      const response = await axios.get(`/api/ai-interview/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAIInterviewRankings(response.data.interviews || [])
    } catch (error) {
      console.error('Failed to fetch AI interview rankings:', error)
      setAIInterviewRankings([])
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      screening: 'bg-yellow-100 text-yellow-800',
      interviewed: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
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
            <p className="text-gray-400 text-sm">Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500 rounded-lg hover:bg-red-500/30 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
            Job Management
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'candidates'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            Candidates & Interviews
          </button>
        </div>

        {/* Job Management Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Posted Jobs</h2>
              <button
                onClick={() => setShowJobForm(!showJobForm)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                {showJobForm ? 'Cancel' : 'Post New Job'}
              </button>
            </div>

            {showJobForm && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Post a New Job</h3>
                <form onSubmit={handlePostJob} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Job Title"
                    value={formData.title}
                    onChange={handleJobFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    name="description"
                    placeholder="Job Description"
                    value={formData.description}
                    onChange={handleJobFormChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="requiredSkills"
                    placeholder="Required Skills (comma-separated)"
                    value={formData.requiredSkills}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="experience"
                    placeholder="Experience Required (e.g., 2-3 years)"
                    value={formData.experience}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="salary"
                    placeholder="Salary Range (e.g., $50k-$70k)"
                    value={formData.salary}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location (e.g., Remote, New York)"
                    value={formData.location}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    name="vacancies"
                    placeholder="Number of Vacancies"
                    value={formData.vacancies}
                    onChange={handleJobFormChange}
                    min="1"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
                  >
                    Post Job
                  </button>
                </form>
              </div>
            )}

            {/* Jobs List */}
            <div className="grid gap-6">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <div key={job._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{job.description.substring(0, 100)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                          {job.status}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this job?')) {
                              handleDeleteJob(job._id)
                            }
                          }}
                          className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500 rounded-full text-sm hover:bg-red-500/30 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Experience</p>
                        <p className="text-white font-semibold">{job.experience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Salary</p>
                        <p className="text-white font-semibold">{job.salary || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="text-white font-semibold">{job.location || 'Remote'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Vacancies</p>
                        <p className="text-white font-semibold">{job.vacancies || 1}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Posted</p>
                        <p className="text-white font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills?.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No jobs posted yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Candidates & Interviews Tab */}
        {activeTab === 'candidates' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Candidates & Interview Management</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Candidates List */}
              <div className="md:col-span-2">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-6">All Candidates (Ranked by Match Score)</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {candidates.length > 0 ? (
                      candidates.map((candidate, index) => (
                        <div
                          key={candidate._id}
                          onClick={() => setSelectedCandidate(candidate)}
                          className={`p-4 rounded-lg cursor-pointer transition ${
                            selectedCandidate?._id === candidate._id
                              ? 'bg-blue-500/20 border border-blue-500'
                              : 'bg-slate-700 border border-slate-600 hover:border-blue-500'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/30 text-blue-300 text-xs font-bold rounded">
                                  #{index + 1}
                                </span>
                                <p className="text-white font-semibold">{candidate.userId?.name || 'Candidate'}</p>
                              </div>
                              <p className="text-gray-400 text-sm">{candidate.userId?.email}</p>
                              <p className="text-cyan-400 text-sm font-semibold mt-1">
                                📋 Applied for: {candidate.jobId?.title || 'Unknown Job'}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Match Score</p>
                              <p className="text-blue-300 font-bold">{candidate.matchScore || 0}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Applied On</p>
                              <p className="text-gray-300 text-xs">{new Date(candidate.appliedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {candidate.extractedSkills && candidate.extractedSkills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {candidate.extractedSkills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {candidate.extractedSkills.length > 3 && (
                                <span className="px-1.5 py-0.5 text-gray-400 text-xs">
                                  +{candidate.extractedSkills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-8">No candidates yet</p>
                    )}
                  </div>
                </div>

                {/* AI Interview Rankings */}
                {aiInterviewRankings.length > 0 && (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-6">AI Interview Rankings</h3>
                    <div className="space-y-3">
                      {aiInterviewRankings.map((ranking) => (
                        <div key={ranking.candidateEmail} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs font-bold rounded">
                                  #{ranking.rank}
                                </span>
                                <p className="text-white font-semibold">{ranking.candidateName}</p>
                              </div>
                              <p className="text-gray-400 text-sm">{ranking.candidateEmail}</p>
                            </div>
                            <p className="text-2xl font-bold text-green-400">{ranking.score}%</p>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {ranking.correctAnswers}/{ranking.totalQuestions} correct • Completed: {new Date(ranking.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Generate AI Interview Link */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Generate AI Interview</h3>
                {selectedCandidate ? (
                  <div className="space-y-4">
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Selected Candidate</p>
                      <p className="text-white font-semibold">{selectedCandidate.userId?.name}</p>
                      <p className="text-gray-400 text-sm">{selectedCandidate.userId?.email}</p>
                    </div>

                    <button
                      onClick={handleSendAIInterview}
                      disabled={sendingInterview}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
                    >
                      {sendingInterview ? 'Generating...' : 'Generate AI Interview Link'}
                    </button>

                    {generatedInterviewLink && (
                      <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mt-4">
                        <p className="text-green-300 font-semibold mb-2">✓ Interview Link Generated</p>
                        <p className="text-gray-300 text-sm mb-3">Share this link with the candidate:</p>
                        <div className="bg-slate-700 p-3 rounded mb-3 break-all">
                          <p className="text-blue-300 text-xs font-mono">{generatedInterviewLink}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedInterviewLink)
                            alert('Link copied to clipboard!')
                          }}
                          className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                        >
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Select a candidate to generate interview link</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
