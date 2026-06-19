import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SKILL_SUGGESTIONS = [
  'JavaScript','TypeScript','Python','Java','React','Node.js','Express.js',
  'MongoDB','PostgreSQL','MySQL','AWS','Docker','Git','HTML','CSS','Vue',
  'Angular','Next.js','GraphQL','REST APIs','Tailwind CSS','Redux',
  'Machine Learning','TensorFlow','PyTorch','SQL','NoSQL','Kubernetes',
  'C++','C#','PHP','Ruby','Go','Swift','Kotlin','Flutter','React Native',
  'Spring Boot','Django','Flask','FastAPI','Firebase','Redis','Elasticsearch',
]

// ── TagInput — fixed: mousedown preventDefault prevents blur before add ──────
function TagInput({ label, values = [], onChange, suggestions = [] }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  // Keep a ref to always have latest values inside callbacks (avoids stale closure)
  const valuesRef = useRef(values)
  useEffect(() => { valuesRef.current = values }, [values])

  const filtered = input.length > 0
    ? suggestions.filter(s =>
        s.toLowerCase().includes(input.toLowerCase()) &&
        !values.map(v => v.toLowerCase()).includes(s.toLowerCase())
      )
    : []

  const add = (val) => {
    const v = val.trim()
    if (!v) return
    const current = valuesRef.current
    if (!current.map(x => x.toLowerCase()).includes(v.toLowerCase())) {
      onChange([...current, v])
    }
    setInput('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const remove = (i) => {
    const current = valuesRef.current
    onChange(current.filter((_, j) => j !== i))
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {values.map((v, i) => (
          <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
            {v}
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); remove(i) }}
              className="text-blue-400 hover:text-red-400 ml-1 leading-none"
            >×</button>
          </span>
        ))}
      </div>
      {/* Input + dropdown */}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); if (input.trim()) add(input) }
            if (e.key === 'Backspace' && !input && values.length) remove(values.length - 1)
          }}
          placeholder="Type skill and press Enter..."
          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {open && filtered.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg overflow-hidden shadow-2xl">
            {filtered.slice(0, 7).map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={e => { e.preventDefault(); add(s) }}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >{s}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── View mode — renders saved profile as a clean card ────────────────────────
function ProfileView({ profile, onEdit }) {
  const avail = { immediate: '🟢 Immediate', notice_period: '🟡 Notice Period', not_looking: '🔴 Not Looking' }
  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white">
              {(profile.headline || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile.headline || 'No headline set'}</h2>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-400">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.phone && <span>📞 {profile.phone}</span>}
                <span>{avail[profile.availability] || profile.availability}</span>
                {profile.availability === 'notice_period' && profile.noticePeriod && (
                  <span className="text-yellow-400">({profile.noticePeriod})</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition">
            ✏️ Edit
          </button>
        </div>
        {profile.summary && <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-700 pt-4">{profile.summary}</p>}
      </div>

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">⚡ Skills <span className="text-slate-500 text-sm font-normal">({profile.skills.length})</span></h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-500/15 text-blue-300 text-sm rounded-full border border-blue-500/25">{s}</span>
            ))}
          </div>
          {profile.certifications?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((c, i) => (
                  <span key={i} className="px-3 py-1.5 bg-violet-500/15 text-violet-300 text-sm rounded-full border border-violet-500/25">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Experience */}
      {profile.experience?.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">💼 Experience</h3>
          <div className="space-y-5">
            {profile.experience.map((exp, i) => (
              <div key={i} className={`pl-4 border-l-2 border-blue-500/40 ${i > 0 ? 'pt-5 border-t border-slate-700' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{exp.title}</p>
                    <p className="text-blue-400 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-slate-500 text-xs whitespace-nowrap ml-4">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education?.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">🎓 Education</h3>
          <div className="space-y-4">
            {profile.education.map((edu, i) => (
              <div key={i} className={`pl-4 border-l-2 border-violet-500/40 ${i > 0 ? 'pt-4 border-t border-slate-700' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-violet-400 text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-slate-500 text-xs whitespace-nowrap ml-4">
                    {edu.startYear}{edu.endYear ? ` — ${edu.endYear}` : ''}
                  </span>
                </div>
                {edu.gpa && <p className="text-slate-400 text-xs mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {profile.portfolioLinks?.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">🔗 Links</h3>
          <div className="flex flex-wrap gap-3">
            {profile.portfolioLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition">
                🔗 {link.label || link.url}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!profile.skills?.length && !profile.experience?.length && !profile.education?.length && (
        <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-2xl">
          <p className="text-slate-400 mb-3">Your profile is empty</p>
          <button onClick={onEdit} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition">
            Start Building Profile
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [mode, setMode] = useState('view')   // 'view' | 'edit'
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    headline: '', summary: '', phone: '', location: '',
    availability: 'immediate', noticePeriod: '',
    skills: [], certifications: [],
    experience: [], education: [], portfolioLinks: [],
  })

  useEffect(() => {
    if (!token) { navigate('/candidate-login'); return }
    axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.data._id) {
          setProfile(r.data)
          // If profile has data, show view mode; otherwise go straight to edit
          const hasData = r.data.skills?.length || r.data.experience?.length || r.data.headline
          setMode(hasData ? 'view' : 'edit')
        } else {
          setMode('edit')
        }
      })
      .catch(() => setMode('edit'))
  }, [])

  const set = (field, val) => setProfile(p => ({ ...p, [field]: val }))

  const addExp = () => set('experience', [...(profile.experience || []), { company: '', title: '', startDate: '', endDate: '', current: false, description: '' }])
  const setExp = (i, field, val) => { const a = [...profile.experience]; a[i] = { ...a[i], [field]: val }; set('experience', a) }
  const removeExp = (i) => set('experience', profile.experience.filter((_, j) => j !== i))

  const addEdu = () => set('education', [...(profile.education || []), { institution: '', degree: '', field: '', startYear: '', endYear: '', gpa: '' }])
  const setEdu = (i, field, val) => { const a = [...profile.education]; a[i] = { ...a[i], [field]: val }; set('education', a) }
  const removeEdu = (i) => set('education', profile.education.filter((_, j) => j !== i))

  const addLink = () => set('portfolioLinks', [...(profile.portfolioLinks || []), { label: '', url: '' }])
  const setLink = (i, field, val) => { const a = [...profile.portfolioLinks]; a[i] = { ...a[i], [field]: val }; set('portfolioLinks', a) }
  const removeLink = (i) => set('portfolioLinks', profile.portfolioLinks.filter((_, j) => j !== i))

  const handleSave = async () => {
    setSaving(true)
    try {
      const r = await axios.put('/api/profile', profile, { headers: { Authorization: `Bearer ${token}` } })
      setProfile(r.data)
      setSaved(true)
      setMode('view')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const ic = "w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  const lc = "block text-sm font-medium text-slate-300 mb-1.5"
  const sc = "bg-slate-800 border border-slate-700 rounded-xl p-6 mb-5"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/candidate-dashboard')} className="text-slate-400 hover:text-white transition text-sm">← Back</button>
            <div>
              <h1 className="text-xl font-bold text-white">My Profile</h1>
              <p className="text-slate-400 text-xs">{mode === 'view' ? 'Your candidate profile' : 'Editing profile'}</p>
            </div>
          </div>
          {mode === 'edit' ? (
            <div className="flex gap-2">
              <button onClick={() => setMode('view')} className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 rounded-lg text-sm transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50">
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
              </button>
            </div>
          ) : (
            <button onClick={() => setMode('edit')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition">
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── VIEW MODE ── */}
        {mode === 'view' && <ProfileView profile={profile} onEdit={() => setMode('edit')} />}

        {/* ── EDIT MODE ── */}
        {mode === 'edit' && (
          <>
            {profile.skills?.length === 0 && (
              <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                <span className="text-amber-400">💡</span>
                <p className="text-amber-300 text-sm">Add your skills to apply without uploading a resume every time.</p>
              </div>
            )}

            {/* Basic Info */}
            <div className={sc}>
              <h2 className="text-base font-bold text-white mb-4">👤 Basic Info</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={lc}>Professional Headline</label>
                  <input value={profile.headline || ''} onChange={e => set('headline', e.target.value)}
                    placeholder="e.g. Full Stack Developer | 3 years experience" className={ic} />
                </div>
                <div>
                  <label className={lc}>Phone</label>
                  <input value={profile.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" className={ic} />
                </div>
                <div>
                  <label className={lc}>Location</label>
                  <input value={profile.location || ''} onChange={e => set('location', e.target.value)} placeholder="City, Country" className={ic} />
                </div>
                <div>
                  <label className={lc}>Availability</label>
                  <select value={profile.availability || 'immediate'} onChange={e => set('availability', e.target.value)} className={ic}>
                    <option value="immediate">Immediate Joining</option>
                    <option value="notice_period">On Notice Period</option>
                    <option value="not_looking">Not Looking</option>
                  </select>
                </div>
                {profile.availability === 'notice_period' && (
                  <div>
                    <label className={lc}>Notice Period</label>
                    <input value={profile.noticePeriod || ''} onChange={e => set('noticePeriod', e.target.value)} placeholder="e.g. 1 month" className={ic} />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className={lc}>Professional Summary</label>
                  <textarea value={profile.summary || ''} onChange={e => set('summary', e.target.value)}
                    rows={3} placeholder="Brief overview of your background..." className={ic + ' resize-none'} />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className={sc}>
              <h2 className="text-base font-bold text-white mb-4">⚡ Skills</h2>
              <TagInput
                label="Technical Skills"
                values={profile.skills || []}
                onChange={v => set('skills', v)}
                suggestions={SKILL_SUGGESTIONS}
              />
              <div className="mt-4">
                <TagInput
                  label="Certifications"
                  values={profile.certifications || []}
                  onChange={v => set('certifications', v)}
                />
              </div>
            </div>

            {/* Experience */}
            <div className={sc}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-white">💼 Experience</h2>
                <button type="button" onClick={addExp} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition">+ Add</button>
              </div>
              {!profile.experience?.length && <p className="text-slate-500 text-sm text-center py-3">No experience added yet</p>}
              {(profile.experience || []).map((exp, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600/50">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Position {i + 1}</span>
                    <button type="button" onClick={() => removeExp(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div><label className={lc}>Job Title *</label><input value={exp.title || ''} onChange={e => setExp(i, 'title', e.target.value)} placeholder="Software Engineer" className={ic} /></div>
                    <div><label className={lc}>Company *</label><input value={exp.company || ''} onChange={e => setExp(i, 'company', e.target.value)} placeholder="Company Name" className={ic} /></div>
                    <div><label className={lc}>Start Date</label><input value={exp.startDate || ''} onChange={e => setExp(i, 'startDate', e.target.value)} placeholder="Jan 2022" className={ic} /></div>
                    <div>
                      <label className={lc}>End Date</label>
                      <input value={exp.current ? 'Present' : (exp.endDate || '')} onChange={e => setExp(i, 'endDate', e.target.value)}
                        disabled={exp.current} placeholder="Dec 2023" className={ic + (exp.current ? ' opacity-50' : '')} />
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input type="checkbox" checked={!!exp.current} onChange={e => setExp(i, 'current', e.target.checked)} className="accent-blue-500" />
                        <span className="text-xs text-slate-400">Currently working here</span>
                      </label>
                    </div>
                    <div className="md:col-span-2"><label className={lc}>Description</label>
                      <textarea value={exp.description || ''} onChange={e => setExp(i, 'description', e.target.value)}
                        rows={2} placeholder="Key responsibilities..." className={ic + ' resize-none'} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className={sc}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-white">🎓 Education</h2>
                <button type="button" onClick={addEdu} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition">+ Add</button>
              </div>
              {!profile.education?.length && <p className="text-slate-500 text-sm text-center py-3">No education added yet</p>}
              {(profile.education || []).map((edu, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600/50">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Education {i + 1}</span>
                    <button type="button" onClick={() => removeEdu(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div><label className={lc}>Degree *</label><input value={edu.degree || ''} onChange={e => setEdu(i, 'degree', e.target.value)} placeholder="Bachelor of Science" className={ic} /></div>
                    <div><label className={lc}>Field of Study</label><input value={edu.field || ''} onChange={e => setEdu(i, 'field', e.target.value)} placeholder="Computer Science" className={ic} /></div>
                    <div className="md:col-span-2"><label className={lc}>Institution *</label><input value={edu.institution || ''} onChange={e => setEdu(i, 'institution', e.target.value)} placeholder="University Name" className={ic} /></div>
                    <div><label className={lc}>Start Year</label><input value={edu.startYear || ''} onChange={e => setEdu(i, 'startYear', e.target.value)} placeholder="2019" className={ic} /></div>
                    <div><label className={lc}>End Year</label><input value={edu.endYear || ''} onChange={e => setEdu(i, 'endYear', e.target.value)} placeholder="2023" className={ic} /></div>
                    <div><label className={lc}>GPA (optional)</label><input value={edu.gpa || ''} onChange={e => setEdu(i, 'gpa', e.target.value)} placeholder="3.8" className={ic} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio Links */}
            <div className={sc}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-white">🔗 Portfolio & Links</h2>
                <button type="button" onClick={addLink} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition">+ Add</button>
              </div>
              {!profile.portfolioLinks?.length && <p className="text-slate-500 text-sm text-center py-3">Add GitHub, LinkedIn, Portfolio, etc.</p>}
              {(profile.portfolioLinks || []).map((link, i) => (
                <div key={i} className="flex gap-3 mb-3 items-center">
                  <input value={link.label || ''} onChange={e => setLink(i, 'label', e.target.value)} placeholder="GitHub" className={ic + ' w-28 flex-shrink-0'} />
                  <input value={link.url || ''} onChange={e => setLink(i, 'url', e.target.value)} placeholder="https://..." className={ic + ' flex-1'} />
                  <button type="button" onClick={() => removeLink(i)} className="text-red-400 hover:text-red-300 flex-shrink-0">✕</button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pb-8 gap-3">
              <button type="button" onClick={() => setMode('view')} className="px-6 py-3 border border-slate-600 text-slate-400 hover:text-white rounded-xl text-sm transition">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-semibold transition disabled:opacity-50">
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
