import React, { useState } from 'react'
import { hrAPI } from '../api'
import JobDescriptionForm from '../components/JobDescriptionForm'
import CandidateRankings from '../components/CandidateRankings'

function HRDashboard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  React.useEffect(() => {
    fetchJobs()
  }, [])

  const refreshJobs = () => {
    fetchJobs()
  }

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await hrAPI.getDashboard()
      setJobs(response.data.jobs)
    } catch (err) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleJobCreated = () => {
    setShowForm(false)
    fetchJobs()
  }

  const handleSelectJob = (job) => {
    setSelectedJob(job)
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>HR Dashboard</h2>
            <p style={{ color: '#7f8c8d', margin: 0 }}>Manage job postings and view candidate rankings</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Create Job'}
            </button>
            <button 
              className="btn btn-danger" 
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear all job descriptions and candidate data? This cannot be undone.')) {
                  try {
                    await hrAPI.clearData()
                    alert('All data cleared successfully')
                    fetchJobs()
                  } catch (err) {
                    alert('Error clearing data')
                  }
                }
              }}
              style={{ padding: '0.75rem 1rem' }}
            >
              🗑️ Clear Data
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {showForm && <JobDescriptionForm onJobCreated={handleJobCreated} />}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#2c3e50' }}>
                <strong>Total Job Postings:</strong> {jobs.length}
              </p>
            </div>

            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>📋 No job postings yet</p>
                <p style={{ color: '#95a5a6' }}>Create your first job description to get started</p>
              </div>
            ) : (
              <div className="grid">
                {jobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="job-card"
                    onClick={() => handleSelectJob(job)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0 }}>{job.title}</h3>
                      <span style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        {job.candidate_count} candidates
                      </span>
                    </div>

                    <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Posted by: <strong>{job.hr_name}</strong>
                    </p>
                    <p style={{ color: '#95a5a6', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>

                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#2c3e50', marginBottom: '0.5rem' }}>
                        <strong>Required Skills:</strong>
                      </p>
                      <div className="skills-list">
                        {job.extracted_skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                        {job.extracted_skills.length > 4 && (
                          <span className="skill-tag">+{job.extracted_skills.length - 4}</span>
                        )}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectJob(job)
                      }}
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      View Candidates
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedJob && (
        <CandidateRankings job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

export default HRDashboard
