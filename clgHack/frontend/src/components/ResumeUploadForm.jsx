import React, { useState } from 'react'
import { candidateAPI } from '../api'

function ResumeUploadForm({ job, onClose, onResumeUploaded }) {
  const [file, setFile] = useState(null)
  const [candidateName, setCandidateName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDescription, setShowDescription] = useState(true)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase()
      if (['pdf', 'docx'].includes(fileType)) {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Only PDF and DOCX files are allowed')
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }
    if (!candidateName.trim()) {
      setError('Please enter your name')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await candidateAPI.uploadResume(job.job_id, candidateName, file)
      setSuccess(`Resume uploaded successfully! Match Score: ${response.data.match_score}%`)
      setFile(null)
      setCandidateName('')
      setTimeout(() => {
        setSuccess('')
        onResumeUploaded()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>{job.title}</h3>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Job Description Section */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Job Description</h4>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '1.5rem',
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
            borderLeft: '4px solid #3498db'
          }}>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {job.description}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: '#2c3e50' }}>Required Skills</h4>
            <div className="skills-list">
              {job.extracted_skills.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Upload Section */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Upload Your Resume</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Resume File (PDF or DOCX)</label>
              <div className="file-upload" onClick={() => document.getElementById('fileInput').click()}>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                <p>
                  {file ? (
                    <>
                      <strong>✓ Selected:</strong> {file.name}
                    </>
                  ) : (
                    <>
                      <strong>📄 Click to select</strong>
                      <br />
                      <small>or drag and drop</small>
                      <br />
                      <small style={{ color: '#95a5a6' }}>PDF or DOCX only</small>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || !file}
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {loading ? '⏳ Uploading & Analyzing...' : '🚀 Upload Resume'}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#e8f4f8',
            borderRadius: '8px',
            borderLeft: '4px solid #3498db'
          }}>
            <h5 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>💡 Tip</h5>
            <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>
              Make sure your resume includes the required skills mentioned above for a better match score.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeUploadForm
