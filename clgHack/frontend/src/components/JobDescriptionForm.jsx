import React, { useState } from 'react'
import { hrAPI } from '../api'

function JobDescriptionForm({ onJobCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hrName, setHrName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await hrAPI.createJobDescription(title, description, hrName)
      setSuccess(`Job created successfully! Extracted skills: ${response.data.extracted_skills.join(', ')}`)
      setTitle('')
      setDescription('')
      setHrName('')
      setTimeout(() => {
        setSuccess('')
        onJobCreated()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3>Create New Job Description</h3>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name (HR)</label>
          <input
            type="text"
            value={hrName}
            onChange={(e) => setHrName(e.target.value)}
            placeholder="e.g., John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Python Developer"
            required
          />
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            required
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Creating...' : 'Create Job Description'}
        </button>
      </form>
    </div>
  )
}

export default JobDescriptionForm
