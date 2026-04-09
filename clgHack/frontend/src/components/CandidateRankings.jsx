import React, { useState, useEffect } from 'react'
import { hrAPI } from '../api'

function CandidateRankings({ job, onClose }) {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCandidates()
  }, [job])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const response = await hrAPI.getRankedCandidates(job.job_id)
      setCandidates(response.data.candidates)
    } catch (err) {
      setError('Failed to fetch candidates')
    } finally {
      setLoading(false)
    }
  }

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return '#f39c12'
    if (rank === 2) return '#95a5a6'
    if (rank === 3) return '#cd7f32'
    return '#3498db'
  }

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return '📌'
  }

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>{job.title} - Candidate Rankings</h3>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Total candidates: {candidates.length}</p>
        </div>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading candidates...</p>
        </div>
      ) : (
        <>
          {candidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>👥 No candidates yet</p>
              <p style={{ color: '#95a5a6' }}>Candidates will appear here as they submit resumes</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Rank</th>
                    <th>Candidate Name</th>
                    <th style={{ width: '120px' }}>Match Score</th>
                    <th style={{ width: '120px' }}>Skill Match</th>
                    <th style={{ width: '140px' }}>Semantic Similarity</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.candidate_name} style={{
                      backgroundColor: candidate.rank === 1 ? '#fffbea' : 'transparent',
                      borderLeft: `4px solid ${getRankBadgeColor(candidate.rank)}`
                    }}>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          backgroundColor: getRankBadgeColor(candidate.rank),
                          color: 'white',
                          borderRadius: '50%',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {getRankEmoji(candidate.rank)}
                        </span>
                      </td>
                      <td>
                        <strong>{candidate.candidate_name}</strong>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            width: '60px',
                            height: '8px',
                            backgroundColor: '#ecf0f1',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${candidate.match_score}%`,
                              height: '100%',
                              backgroundColor: candidate.match_score >= 80 ? '#27ae60' : candidate.match_score >= 60 ? '#f39c12' : '#e74c3c'
                            }}></div>
                          </div>
                          <strong style={{ color: '#2c3e50' }}>{candidate.match_score}%</strong>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: candidate.skill_match_score >= 80 ? '#d4edda' : candidate.skill_match_score >= 60 ? '#fff3cd' : '#f8d7da',
                          color: candidate.skill_match_score >= 80 ? '#155724' : candidate.skill_match_score >= 60 ? '#856404' : '#721c24',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {candidate.skill_match_score}%
                        </span>
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: candidate.semantic_similarity >= 80 ? '#d4edda' : candidate.semantic_similarity >= 60 ? '#fff3cd' : '#f8d7da',
                          color: candidate.semantic_similarity >= 80 ? '#155724' : candidate.semantic_similarity >= 60 ? '#856404' : '#721c24',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {candidate.semantic_similarity}%
                        </span>
                      </td>
                      <td>
                        <div className="skills-list">
                          {candidate.extracted_skills.slice(0, 2).map((skill) => (
                            <span key={skill} className="skill-tag">{skill}</span>
                          ))}
                          {candidate.extracted_skills.length > 2 && (
                            <span className="skill-tag">+{candidate.extracted_skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CandidateRankings
