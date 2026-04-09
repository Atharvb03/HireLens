const API_URL = 'http://localhost:8000/api';

class InterviewApp {
    constructor() {
        this.currentSession = null;
        this.currentQuestionIndex = 0;
        this.isRecording = false;
        this.recognition = null;
        this.init();
    }

    init() {
        this.render();
    }

    parseFeedback(feedback) {
        try {
            const parsed = JSON.parse(feedback);
            return parsed.feedback || feedback;
        } catch (e) {
            return feedback;
        }
    }

    render() {
        const root = document.getElementById('root');
        root.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>🎯 AI Interview System</h1>
                    <p>Professional AI-Powered Recruitment Interviews</p>
                </div>
                ${this.currentSession ? this.renderInterview() : this.renderSetup()}
            </div>
        `;
        this.attachEventListeners();
    }

    renderSetup() {
        return `
            <div class="card">
                <h2>Start Interview Session</h2>
                <form id="setupForm">
                    <div class="form-group">
                        <label>Candidate ID</label>
                        <input type="text" id="candidateId" required placeholder="e.g., CAND-001">
                    </div>
                    <div class="form-group">
                        <label>Job Role</label>
                        <input type="text" id="jobRole" required placeholder="e.g., Senior Software Engineer">
                    </div>
                    <div class="form-group">
                        <label>Job Description</label>
                        <textarea id="jobDescription" required placeholder="Describe the job responsibilities..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Required Skills</label>
                        <div id="requiredSkillsContainer"></div>
                        <button type="button" class="btn btn-secondary" id="addRequiredSkill">+ Add Skill</button>
                    </div>
                    <div class="form-group">
                        <label>Candidate Skills (from Resume)</label>
                        <div id="candidateSkillsContainer"></div>
                        <button type="button" class="btn btn-secondary" id="addCandidateSkill">+ Add Skill</button>
                    </div>
                    <button type="submit" class="btn btn-primary">Start Interview</button>
                </form>
            </div>
        `;
    }

    renderInterview() {
        const session = this.currentSession;
        const questions = session.questions || [];
        const currentQuestion = questions[this.currentQuestionIndex];

        if (!currentQuestion) {
            return this.renderCompletion();
        }

        const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;
        const isCoding = currentQuestion.type === "coding";

        return `
            <div class="card">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="question-container">
                    <div class="question-number">Question ${currentQuestion.question_number} of ${questions.length} ${currentQuestion.type ? `(${currentQuestion.type.toUpperCase()})` : ''}</div>
                    <div class="question-text">${currentQuestion.question_text}</div>
                    <button class="btn btn-secondary" id="speakBtn" style="margin-bottom: 15px;">🔊 Hear Question</button>
                    
                    ${isCoding ? `
                        <textarea id="answerInput" class="answer-input" placeholder="Write your code here..." style="font-family: monospace; font-size: 12px;"></textarea>
                    ` : `
                        <textarea id="answerInput" class="answer-input" placeholder="Type your answer here..."></textarea>
                    `}
                    
                    <div class="button-group">
                        <button class="btn btn-primary" id="submitAnswerBtn">Submit Answer</button>
                        <button class="btn btn-secondary" id="followupBtn" style="display:none;">Ask Follow-up</button>
                        <button class="btn btn-danger" id="voiceBtn">🎤 Record Answer</button>
                    </div>
                </div>
                ${currentQuestion.feedback ? `
                    <div class="feedback">
                        <strong>Feedback:</strong> ${this.parseFeedback(currentQuestion.feedback)}
                        <div class="score-display">${currentQuestion.score}/10</div>
                        <button class="btn btn-secondary" style="margin-top: 10px;" onclick="document.getElementById('followupBtn').click()">Ask Follow-up Question</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderCompletion() {
        const session = this.currentSession;
        return `
            <div class="card">
                <h2>Interview Complete</h2>
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Generating final summary...</p>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const setupForm = document.getElementById('setupForm');
        if (setupForm) {
            setupForm.addEventListener('submit', (e) => this.handleStartInterview(e));
            document.getElementById('addRequiredSkill')?.addEventListener('click', () => this.addSkillInput('required'));
            document.getElementById('addCandidateSkill')?.addEventListener('click', () => this.addSkillInput('candidate'));
        }

        document.getElementById('submitAnswerBtn')?.addEventListener('click', () => this.submitAnswer());
        document.getElementById('voiceBtn')?.addEventListener('click', () => this.toggleVoiceRecording());
        document.getElementById('speakBtn')?.addEventListener('click', () => this.speakQuestion());
        document.getElementById('followupBtn')?.addEventListener('click', () => this.askFollowup());
    }

    addSkillInput(type) {
        const container = document.getElementById(type === 'required' ? 'requiredSkillsContainer' : 'candidateSkillsContainer');
        const input = document.createElement('div');
        input.className = 'skills-input';
        input.innerHTML = `
            <input type="text" class="skill-input" placeholder="Enter skill">
            <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">Remove</button>
        `;
        container.appendChild(input);
    }

    async handleStartInterview(e) {
        e.preventDefault();

        const requiredSkills = Array.from(document.querySelectorAll('#requiredSkillsContainer .skill-input'))
            .map(input => input.value)
            .filter(v => v);
        const candidateSkills = Array.from(document.querySelectorAll('#candidateSkillsContainer .skill-input'))
            .map(input => input.value)
            .filter(v => v);

        const payload = {
            candidate_id: document.getElementById('candidateId').value,
            job_role: document.getElementById('jobRole').value,
            job_description: document.getElementById('jobDescription').value,
            required_skills: requiredSkills,
            candidate_skills: candidateSkills
        };

        try {
            const response = await fetch(`${API_URL}/interviews/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to start interview');
            this.currentSession = await response.json();
            this.currentQuestionIndex = 0;
            this.render();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async submitAnswer() {
        const answer = document.getElementById('answerInput').value.trim();
        if (!answer) {
            alert('Please provide an answer');
            return;
        }

        const currentQuestion = this.currentSession.questions[this.currentQuestionIndex];

        try {
            const response = await fetch(`${API_URL}/interviews/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: this.currentSession.id,
                    question_id: currentQuestion.id,
                    answer: answer
                })
            });

            if (!response.ok) throw new Error('Failed to submit answer');
            const evaluation = await response.json();

            currentQuestion.candidate_answer = answer;
            currentQuestion.score = evaluation.score;
            currentQuestion.feedback = JSON.stringify(evaluation);

            this.currentQuestionIndex++;
            if (this.currentQuestionIndex >= this.currentSession.questions.length) {
                await this.completeInterview();
            } else {
                this.render();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    speakQuestion() {
        const currentQuestion = this.currentSession.questions[this.currentQuestionIndex];
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    toggleVoiceRecording() {
        if (!this.isRecording) {
            this.startVoiceRecording();
        } else {
            this.stopVoiceRecording();
        }
    }

    startVoiceRecording() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            alert('Speech Recognition not supported. Please use Chrome, Edge, or Safari.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let transcript = '';
        const voiceBtn = document.getElementById('voiceBtn');
        const answerInput = document.getElementById('answerInput');

        recognition.onstart = () => {
            this.isRecording = true;
            voiceBtn.classList.add('recording');
            voiceBtn.textContent = '⏹️ Stop Recording';
            transcript = '';
            answerInput.placeholder = 'Listening...';
        };

        recognition.onresult = (event) => {
            transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    transcript += ' ';
                }
            }
            answerInput.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            alert('Error: ' + event.error);
            this.stopVoiceRecording();
        };

        recognition.onend = () => {
            this.isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.textContent = '🎤 Record Answer';
            answerInput.placeholder = 'Type your answer here...';
        };

        recognition.start();
        this.recognition = recognition;
    }

    stopVoiceRecording() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isRecording = false;
        const voiceBtn = document.getElementById('voiceBtn');
        voiceBtn.classList.remove('recording');
        voiceBtn.textContent = '🎤 Record Answer';
    }

    async askFollowup() {
        const currentQuestion = this.currentSession.questions[this.currentQuestionIndex];
        
        try {
            const response = await fetch(`${API_URL}/interviews/${this.currentSession.id}/followup?question_id=${currentQuestion.id}`, {
                method: 'POST'
            });
            
            if (!response.ok) throw new Error('Failed to get follow-up question');
            const data = await response.json();
            
            const followupAnswer = prompt(data.followup_question);
            
            if (followupAnswer) {
                const followupResponse = await fetch(`${API_URL}/interviews/answer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session_id: this.currentSession.id,
                        question_id: currentQuestion.id,
                        answer: followupAnswer
                    })
                });
                
                if (!followupResponse.ok) throw new Error('Failed to submit follow-up answer');
                alert('Follow-up answer recorded!');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async completeInterview() {
        try {
            const response = await fetch(`${API_URL}/interviews/${this.currentSession.id}/complete`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Failed to complete interview');
            const summary = await response.json();

            this.showFinalSummary(summary);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    showFinalSummary(summary) {
        const root = document.getElementById('root');
        root.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>✅ Interview Complete</h1>
                </div>
                <div class="card">
                    <h2>Interview Results</h2>
                    <div class="summary">
                        <div class="summary-item">
                            <span class="summary-label">Final Interview Score</span>
                            <span class="summary-value">${(summary.percentage).toFixed(1)}%</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Technical Knowledge</span>
                            <span class="summary-value">${(summary.technical_knowledge).toFixed(1)}%</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Communication</span>
                            <span class="summary-value">${(summary.communication).toFixed(1)}%</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Problem Solving</span>
                            <span class="summary-value">${(summary.problem_solving).toFixed(1)}%</span>
                        </div>
                    </div>

                    <h3 style="margin-top: 30px; margin-bottom: 15px;">Strengths</h3>
                    <ul style="margin-left: 20px; margin-bottom: 20px;">
                        ${summary.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>

                    <h3 style="margin-bottom: 15px;">Areas for Improvement</h3>
                    <ul style="margin-left: 20px; margin-bottom: 20px;">
                        ${summary.weaknesses.map(w => `<li>${w}</li>`).join('')}
                    </ul>

                    <button class="btn btn-primary" onclick="location.reload()">Start New Interview</button>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InterviewApp();
});
