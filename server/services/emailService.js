import nodemailer from 'nodemailer'

// Single shared transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

const FROM = `"HireLens" <${process.env.EMAIL_USER}>`

// ── Helpers ──────────────────────────────────────────────────────────────────

function baseTemplate(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0a0f1e; color:#e2e8f0; margin:0; padding:0; }
    .wrap { max-width:560px; margin:32px auto; background:#0f1729; border:1px solid #1e2d4a; border-radius:16px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#1d4ed8,#7c3aed); padding:28px 32px; }
    .header h1 { margin:0; font-size:22px; color:#fff; letter-spacing:-0.5px; }
    .header p  { margin:4px 0 0; font-size:13px; color:rgba(255,255,255,0.7); }
    .body { padding:28px 32px; }
    .body p  { margin:0 0 16px; font-size:15px; line-height:1.6; color:#cbd5e1; }
    .badge { display:inline-block; padding:4px 12px; border-radius:999px; font-size:12px; font-weight:600; }
    .badge-blue   { background:rgba(59,130,246,0.15); color:#60a5fa; border:1px solid rgba(59,130,246,0.3); }
    .badge-green  { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); }
    .badge-red    { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.3); }
    .badge-violet { background:rgba(139,92,246,0.15); color:#a78bfa; border:1px solid rgba(139,92,246,0.3); }
    .score-box { background:#1a2540; border:1px solid #1e2d4a; border-radius:12px; padding:16px 20px; margin:16px 0; }
    .score-box .label { font-size:12px; color:#64748b; margin-bottom:4px; }
    .score-box .value { font-size:28px; font-weight:700; }
    .btn { display:inline-block; padding:13px 28px; background:linear-gradient(135deg,#1d4ed8,#7c3aed); color:#fff !important; text-decoration:none; border-radius:10px; font-weight:600; font-size:15px; margin:8px 0; }
    .divider { border:none; border-top:1px solid #1e2d4a; margin:20px 0; }
    .footer { padding:16px 32px; background:#080d1a; text-align:center; font-size:12px; color:#334155; }
    .info-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; font-size:14px; color:#94a3b8; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>🔍 HireLens</h1>
      <p>Recruitment Intelligence Platform</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">© 2026 HireLens · This is an automated message, please do not reply.</div>
  </div>
</body>
</html>`
}

async function send(to, subject, html) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email not configured — skipping send to', to)
    return false
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html })
    console.log(`✅ Email sent → ${to} | ${subject}`)
    return true
  } catch (err) {
    console.error(`❌ Email failed → ${to}:`, err.message)
    return false
  }
}

// ── Email templates ───────────────────────────────────────────────────────────

/**
 * Sent to candidate when application is received
 */
export async function sendApplicationReceived({ to, candidateName, jobTitle, matchScore, status }) {
  const statusLabel = status === 'screening' ? 'Moved to Screening' : 'Under Review'
  const badgeClass  = status === 'screening' ? 'badge-blue' : 'badge-violet'
  const scoreColor  = matchScore >= 80 ? '#34d399' : matchScore >= 60 ? '#60a5fa' : '#f87171'

  const html = baseTemplate(`
    <p>Hi <strong>${candidateName}</strong>,</p>
    <p>Your application for <strong>${jobTitle}</strong> has been received and processed by our AI system.</p>
    <div class="score-box">
      <div class="label">AI Match Score</div>
      <div class="value" style="color:${scoreColor}">${matchScore}%</div>
    </div>
    <p>Current status: <span class="badge ${badgeClass}">${statusLabel}</span></p>
    <p>We'll notify you as your application progresses. Good luck!</p>
  `)
  return send(to, `Application Received — ${jobTitle}`, html)
}

/**
 * Sent to candidate when interview link is generated
 */
export async function sendInterviewInvite({ to, candidateName, jobTitle, interviewLink, expiresAt }) {
  const expiry = new Date(expiresAt).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  const html = baseTemplate(`
    <p>Hi <strong>${candidateName}</strong>,</p>
    <p>Congratulations! You've been selected for an AI-powered interview for the <strong>${jobTitle}</strong> position.</p>
    <hr class="divider">
    <p>Click the button below to start your interview. The session is available until <strong>${expiry}</strong>.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${interviewLink}" class="btn">🤖 Start AI Interview</a>
    </p>
    <div class="score-box">
      <div class="info-row">⏱️ Estimated time: 15–20 minutes</div>
      <div class="info-row">📅 Expires: ${expiry}</div>
      <div class="info-row">💡 Tip: Find a quiet place and answer thoroughly</div>
    </div>
    <p style="font-size:13px;color:#64748b;">If the button doesn't work, copy this link: <br>${interviewLink}</p>
  `)
  return send(to, `Interview Invitation — ${jobTitle}`, html)
}

/**
 * Sent to candidate when interview is completed and status changes
 */
export async function sendStatusUpdate({ to, candidateName, jobTitle, newStatus, interviewScore, statusNote }) {
  const configs = {
    hired:       { emoji:'🎉', label:'Congratulations — You\'re Hired!', badgeClass:'badge-green',  msg:'We are thrilled to inform you that you have been selected for this position. Our team will be in touch shortly with next steps.' },
    rejected:    { emoji:'📋', label:'Application Update',               badgeClass:'badge-red',    msg:'After careful review, we have decided to move forward with other candidates at this time. We encourage you to apply for future openings.' },
    interviewed: { emoji:'⏳', label:'Interview Complete — Under Review', badgeClass:'badge-violet', msg:'Your interview has been completed and is currently under review by our recruitment team. We will update you soon.' },
    screening:   { emoji:'🔍', label:'Application Shortlisted',          badgeClass:'badge-blue',   msg:'Your profile has been shortlisted for further review. Stay tuned for next steps.' },
  }
  const cfg = configs[newStatus] || configs.screening
  const scoreColor = interviewScore >= 70 ? '#34d399' : interviewScore >= 50 ? '#60a5fa' : '#f87171'

  const html = baseTemplate(`
    <p>Hi <strong>${candidateName}</strong>,</p>
    <p>${cfg.emoji} <strong>${cfg.label}</strong></p>
    <p>Regarding your application for <strong>${jobTitle}</strong>:</p>
    <p>${cfg.msg}</p>
    ${interviewScore != null ? `
    <div class="score-box">
      <div class="label">Interview Score</div>
      <div class="value" style="color:${scoreColor}">${interviewScore}%</div>
    </div>` : ''}
    ${statusNote ? `<p style="font-size:13px;color:#64748b;font-style:italic;">${statusNote}</p>` : ''}
    <p>Status: <span class="badge ${cfg.badgeClass}">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span></p>
  `)
  return send(to, `${cfg.emoji} Application Update — ${jobTitle}`, html)
}
