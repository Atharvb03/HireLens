import React, { useState, useEffect } from 'react'
import { candidateAPI } from '../api'
import JobList from '../components/JobList'
import ResumeUploadForm from '../components/ResumeUploadForm'

function CandidateUpload() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await candidateAPI.getAvailableJobs()
      setJobs(response.data.jobs)
    } catch (err) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleResumeUploaded = () => {
    fetchJobs()
    setSelectedJob(null)
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '2rem' }}>Available Job Positions</h2>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <>
            {jobs.length === 0 ? (
              <p style={{ color: '#7f8c8d' }}>No jobs available at the moment.</p>
            ) : (
              <JobList
                jobs={jobs}
                onSelectJob={setSelectedJob}
              />
            )}
          </>
        )}
      </div>

      {selectedJob && (
        <ResumeUploadForm
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onResumeUploaded={handleResumeUploaded}
        />
      )}
    </div>
  )
}

export default CandidateUpload
