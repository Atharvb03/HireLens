import React from 'react'

function JobList({ jobs, onSelectJob }) {
  return (
    <div className="grid">
      {jobs.map((job) => (
        <div key={job.job_id} className="job-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>{job.title}</h3>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                Posted by: <strong>{job.hr_name}</strong>
              </p>
            </div>
          </div>
          
          <p style={{ color: '#7f8c8d', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {new Date(job.created_at).toLocaleDateString()}
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Required Skills:</h4>
            <div className="skills-list">
              {job.extracted_skills.slice(0, 5).map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
              {job.extracted_skills.length > 5 && (
                <span className="skill-tag">+{job.extracted_skills.length - 5} more</span>
              )}
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onSelectJob(job)}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            View & Upload Resume
          </button>
        </div>
      ))}
    </div>
  )
}

export default JobList
