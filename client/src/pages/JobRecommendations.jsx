import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ScoreBadge({ score }) {
  const color = score >= 70 ? 'text-green-400 bg-green-500/10 border-green-500/30'
    : score >= 50 ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    : 'text-slate-400 bg-slate-500/10 border-slate-500/30'
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      {score}% match
    </span>
  )
}

export default function JobRecommendations() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [mode, setMode] = useState('profile') // 'profile' | 'upload'
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/candidate-login'); return }
    axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setProfile(r.data))
      .catch(console.error)
  }, [])

  const hasProfile = profile?.skills?.length > 0

  const findJobs = async () => {
    setLoading(true)
    setError('')
    try {
      let data
      if (mode === 'profile') {
        const r = await axios.post('/api/profile/recommend-jobs', {}, { headers: { Authorization: `Bearer ${token}` } })
        data = r.data
      } else {
        if (!resumeFile) { setError('Please select a resume file'); setLoading(false); return }
        const form = new FormData()
        form.append('resume', resumeFile)
        const r = await axios.post('/api/analysis/find-best-jobs', form, { headers: { Authorization: `Bearer ${token}` } })
        data = r.data
      }
      setJobs(data.topJobs || [])
      setLoaded(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to find jobs. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/candidate-dashboard')} className="text-slate-400 hover:text-white transition">← Back</button>
            <div>
              <h1 className="text-xl font-bold text-white">Job Recommendations</h1>
              <p className="text-slate-400 text-xs">AI-matched jobs from across the web</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Source selector */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">Find jobs based on:</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Profile option */}
            <button
              onClick={() => setMode('profile')}
              className={`p-4 rounded-xl border text-left transition ${
                mode === 'profile'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-white font-semibold text-sm">My Saved Profile</p>
                  {hasProfile
                    ? <p className="text-green-400 text-xs">{profile.skills.length} skills saved</p>
                    : <p className="text-amber-400 text-xs">Profile incomplete — add skills first</p>
                  }
                </div>
                {mode === 'profile' && <span className="ml-auto text-blue-400">✓</span>}
              </div>
              <p className="text-slate-400 text-xs">Uses your saved skills and experience. No upload needed.</p>
            </button>

            {/* Upload option */}
            <button
              onClick={() => setMode('upload')}
              className={`p-4 rounded-xl border text-left transition ${
                mode === 'upload'
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-white font-semibold text-sm">Upload Resume</p>
                  <p className="text-slate-400 text-xs">PDF, DOCX, or TXT</p>
                </div>
                {mode === 'upload' && <span className="ml-auto text-violet-400">✓</span>}
              </div>
              <p className="text-slate-400 text-xs">Upload a resume file for one-time analysis.</p>
            </button>
          </div>

          {mode === 'upload' && (
            <div className="mb-4">
              <input type="file" accept=".pdf,.doc,.docx,.txt"
                onChange={e => setResumeFile(e.target.files?.[0])}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              {resumeFile && <p className="text-slate-400 text-xs mt-1">Selected: {resumeFile.name}</p>}
            </div>
          )}

          {mode === 'profile' && !hasProfile && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
              <span className="text-amber-400">⚠️</span>
              <p className="text-amber-300 text-sm">
                Your profile has no skills.{' '}
                <button onClick={() => navigate('/profile')} className="underline hover:text-amber-200">Complete your profile</button>
                {' '}first.
              </p>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={findJobs}
            disabled={loading || (mode === 'profile' && !hasProfile)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Searching jobs across the web...</>
            ) : (
              <><span>🔍</span> Find My Best Matching Jobs</>
            )}
          </button>
        </div>

        {/* Results */}
        {loaded && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">
                {jobs.length} Jobs Found
              </h2>
              <span className="text-slate-400 text-sm">Sorted by match score</span>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-xl">
                <p className="text-slate-400 text-lg mb-2">No matching jobs found</p>
                <p className="text-slate-500 text-sm">Try adding more skills to your profile or uploading a different resume</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, i) => (
                  <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition group">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-white font-bold text-lg leading-tight">{job.jobTitle}</h3>
                          <ScoreBadge score={job.matchScore} />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                          {job.company && <span className="font-medium text-slate-300">{job.company}</span>}
                          {job.location && <span>📍 {job.location}</span>}
                          {job.salary && <span>💰 {job.salary}</span>}
                          {job.source && <span className="px-2 py-0.5 bg-slate-700 rounded text-xs">{job.source}</span>}
                        </div>
                      </div>
                      {job.jobUrl && (
                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition">
                          Apply →
                        </a>
                      )}
                    </div>

                    {/* Match score bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Match Score</span>
                        <span className={job.matchScore >= 70 ? 'text-green-400' : job.matchScore >= 50 ? 'text-blue-400' : 'text-slate-400'}>
                          {job.matchScore}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${job.matchScore >= 70 ? 'bg-green-500' : job.matchScore >= 50 ? 'bg-blue-500' : 'bg-slate-500'}`}
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Required skills */}
                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.slice(0, 8).map((s, j) => (
                          <span key={j} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">{s}</span>
                        ))}
                        {job.requiredSkills.length > 8 && (
                          <span className="text-slate-500 text-xs py-0.5">+{job.requiredSkills.length - 8} more</span>
                        )}
                      </div>
                    )}

                    {/* Description preview */}
                    {job.jobDescription && (
                      <p className="text-slate-500 text-xs mt-3 line-clamp-2">{job.jobDescription}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
