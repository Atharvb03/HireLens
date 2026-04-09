import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function InterviewPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [evaluations, setEvaluations] = useState({})
  const [error, setError] = useState(null)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(null)
  
  // Voice features
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)
  const sessionRef = useRef(null)
  const currentQuestionIndexRef = useRef(0)
  const answersRef = useRef({})

  useEffect(() => {
    setupVoiceRecognition()
    startInterview()
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {}
      }
      window.speechSynthesis.cancel()
    }
  }, [token])

  // Keep refs in sync with state
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex
  }, [currentQuestionIndex])

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const setupVoiceRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        console.warn('⚠️ Speech Recognition not supported in this browser')
        setVoiceSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        isListeningRef.current = true
        setIsListening(true)
        console.log('✅ Recording started - listening for voice input')
      }

      recognition.onresult = (event) => {
        console.log('🎤 Speech result received:', event.results.length, 'results')
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          console.log(`  Result ${i}: "${transcript}" (isFinal: ${event.results[i].isFinal})`)

          // Only process final results to avoid duplicates
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          }
        }

        // Only update if we have final transcription
        if (finalTranscript.trim()) {
          const combinedTranscript = finalTranscript.trim()
          console.log('📝 Final transcript:', combinedTranscript)
          console.log('Session exists:', !!sessionRef.current)
          console.log('Current question index:', currentQuestionIndexRef.current)
          
          // Update answer using refs
          const session = sessionRef.current
          const currentQuestionIndex = currentQuestionIndexRef.current
          const currentAnswers = answersRef.current
          
          if (session && session.questions && session.questions[currentQuestionIndex]) {
            const currentQuestion = session.questions[currentQuestionIndex]
            const currentAnswer = currentAnswers[currentQuestion.id] || ''
            const newAnswer = (currentAnswer + ' ' + combinedTranscript).trim()
            
            setAnswers(prev => ({
              ...prev,
              [currentQuestion.id]: newAnswer
            }))
            
            console.log('✅ Updated answer for question:', currentQuestion.id, '→', newAnswer)
          } else {
            console.warn('⚠️ Could not find current question')
          }
        }
      }

      recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error)
        isListeningRef.current = false
        setIsListening(false)
        
        if (event.error === 'no-speech') {
          console.warn('No speech detected. Please try again.')
        } else if (event.error === 'network') {
          alert('Network error. Please check your internet connection.')
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access in browser settings.')
        } else {
          alert(`Microphone error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        isListeningRef.current = false
        setIsListening(false)
        console.log('⏹️ Recording stopped')
      }

      recognitionRef.current = recognition
      console.log('✅ Voice recognition setup complete')
    } catch (err) {
      console.error('Error setting up voice recognition:', err)
      setVoiceSupported(false)
    }
  }

  const startListening = () => {
    try {
      if (!recognitionRef.current) {
        console.error('Voice recognition not initialized')
        alert('Voice recognition not initialized. Please refresh the page.')
        return
      }
      
      if (isListeningRef.current) {
        console.log('Already listening')
        return
      }

      console.log('🎤 Starting to listen...')
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting listening:', err)
      alert('Error starting microphone: ' + err.message)
    }
  }

  const stopListening = () => {
    try {
      if (!recognitionRef.current) {
        console.error('Voice recognition not initialized')
        return
      }

      if (!isListeningRef.current) {
        console.log('Not currently listening')
        return
      }

      console.log('⏹️ Stopping listening...')
      recognitionRef.current.stop()
    } catch (err) {
      console.error('Error stopping listening:', err)
      alert('Error stopping microphone: ' + err.message)
    }
  }

  const speakQuestion = (text) => {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      utterance.lang = 'en-US'

      utterance.onstart = () => {
        console.log('🔊 Speech synthesis started')
        setIsSpeaking(true)
      }
      
      utterance.onend = () => {
        console.log('🔊 Speech synthesis ended')
        setIsSpeaking(false)
      }
      
      utterance.onerror = (event) => {
        console.error('🔊 Speech synthesis error:', event.error)
        setIsSpeaking(false)
      }

      console.log('🔊 Speaking:', text.substring(0, 50) + '...')
      window.speechSynthesis.speak(utterance)
    } catch (err) {
      console.error('Error speaking:', err)
      alert('Error playing audio: ' + err.message)
    }
  }

  const startInterview = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Interview token:', token)

      // Get interview details from token
      const interviewResponse = await axios.get(`/api/ai-interview/${token}`)
      console.log('Interview response:', interviewResponse.data)

      if (!interviewResponse.data.interview) {
        setError('Interview not found or expired')
        setLoading(false)
        return
      }

      const interview = interviewResponse.data.interview
      const jobTitle = interview.jobTitle || 'Interview'
      const jobDescription = interview.jobDescription || `Interview for ${jobTitle} position`
      const requiredSkills = interview.requiredSkills || []

      // Start interview session
      const sessionResponse = await axios.post('/api/interview-session/start', {
        candidateId: localStorage.getItem('userId'),
        jobRole: jobTitle,
        jobDescription: jobDescription,
        requiredSkills: requiredSkills,
        candidateSkills: [],
        interviewToken: token
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      console.log('Session response:', sessionResponse.data)
      setSession(sessionResponse.data.session)
      setLoading(false)
    } catch (error) {
      console.error('Error starting interview:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to start interview'
      setError(errorMsg)
      setLoading(false)
    }
  }

  const handleAnswerChange = (e) => {
    const currentQuestion = session.questions[currentQuestionIndex]
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value
    })
  }

  const submitAnswer = async () => {
    try {
      setSubmitting(true)
      const currentQuestion = session.questions[currentQuestionIndex]
      const answer = answers[currentQuestion.id] || ''

      if (!answer.trim()) {
        alert('Please provide an answer')
        setSubmitting(false)
        return
      }

      // Submit answer for evaluation but don't show it yet
      const response = await axios.post('/api/interview-session/answer', {
        sessionId: session.sessionId,
        questionId: currentQuestion.id,
        answer
      })

      // Store evaluation for later display
      setEvaluations({
        ...evaluations,
        [currentQuestion.id]: response.data.evaluation
      })

      setSubmitting(false)
      
      // Move to next question or complete interview
      if (currentQuestionIndex < session.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // All questions answered, complete the interview
        completeInterview()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer: ' + (error.response?.data?.error || error.message))
      setSubmitting(false)
    }
  }

  const completeInterview = async () => {
    try {
      setSubmitting(true)
      const response = await axios.post(`/api/interview-session/${session.sessionId}/complete`)
      
      setFinalScore(response.data.summary.finalScore)
      setInterviewComplete(true)
      setSubmitting(false)
    } catch (error) {
      console.error('Error completing interview:', error)
      alert('Failed to complete interview: ' + (error.response?.data?.error || error.message))
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Starting interview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-red-500 rounded-lg p-8 max-w-md text-center">
          <p className="text-red-400 font-semibold mb-4">Error</p>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/candidate-dashboard')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Interview not found</p>
        </div>
      </div>
    )
  }

  // Show results page after interview completion
  if (interviewComplete) {
    const resultMessage = finalScore >= 80 ? 'Excellent performance!' : finalScore >= 70 ? 'Great job!' : finalScore >= 50 ? 'Good effort!' : 'Keep practicing!'
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Final Score Header */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Interview Completed!
            </h1>
            <div className="text-6xl font-bold mb-4">
              <span className={finalScore >= 70 ? 'text-green-400' : finalScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                {finalScore}%
              </span>
            </div>
            <p className="text-gray-300 text-lg mb-4">
              {resultMessage}
            </p>
            <button
              onClick={() => speakQuestion(`Your interview is complete. Your score is ${finalScore} percent. ${resultMessage}`)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold"
              title="Hear your results"
            >
              🔊 Hear Results
            </button>
          </div>

          {/* Detailed Evaluations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Detailed Evaluations</h2>
            {session.questions.map((question, index) => (
              <div key={question.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">Question {index + 1}</h3>
                    {evaluations[question.id] && (
                      <span className={`text-xl font-bold ${evaluations[question.id].score >= 70 ? 'text-green-400' : evaluations[question.id].score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {evaluations[question.id].score}%
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-3">{question.text}</p>
                  <div className="bg-slate-700/50 rounded p-3 mb-3">
                    <p className="text-gray-300 text-sm"><strong>Your Answer:</strong> {answers[question.id]}</p>
                  </div>
                </div>

                {evaluations[question.id] && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-gray-300 mb-3">{evaluations[question.id].feedback}</p>
                    {evaluations[question.id].strengths && evaluations[question.id].strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-green-400 font-semibold mb-2">Strengths:</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm">
                          {evaluations[question.id].strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {evaluations[question.id].improvements && evaluations[question.id].improvements.length > 0 && (
                      <div>
                        <p className="text-yellow-400 font-semibold mb-2">Areas for Improvement:</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm">
                          {evaluations[question.id].improvements.map((i, idx) => <li key={idx}>{i}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate('/candidate-dashboard')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = session.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1
  const isAnswered = !!answers[currentQuestion.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI Interview
              </h1>
              <p className="text-gray-400 text-sm mt-1">Question {currentQuestionIndex + 1} of {session.questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Progress</p>
              <p className="text-2xl font-bold text-blue-400">{Math.round((currentQuestionIndex + 1) / session.questions.length * 100)}%</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestionIndex + 1) / session.questions.length * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded">
              {currentQuestion.type.toUpperCase()}
            </span>
            <h2 className="text-2xl font-bold text-white mt-4">{currentQuestion.text}</h2>
          </div>

          {/* Voice Controls - ALWAYS SHOW */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {!voiceSupported && (
              <div className="w-full p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg mb-3">
                <p className="text-yellow-300 text-sm">⚠️ Voice features not supported in your browser. Please use Chrome, Edge, or Firefox.</p>
              </div>
            )}
            <button
              onClick={() => speakQuestion(currentQuestion.text)}
              disabled={isSpeaking || !voiceSupported}
              className="px-4 py-2 bg-purple-500 text-white border border-purple-600 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              title="Listen to question"
            >
              🔊 {isSpeaking ? 'Speaking...' : 'Hear Question'}
            </button>
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!voiceSupported}
              className={`px-6 py-2 rounded-lg transition font-semibold border text-white ${
                isListening
                  ? 'bg-red-600 border-red-700 hover:bg-red-700 animate-pulse'
                  : 'bg-green-600 border-green-700 hover:bg-green-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? 'Click to stop recording' : 'Click to start recording'}
            >
              🎤 {isListening ? '⏹️ Stop Recording' : '▶️ Start Recording'}
            </button>
          </div>

          {/* Recording Status */}
          {isListening && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300 font-semibold">🔴 Recording in progress...</p>
              <p className="text-red-200 text-sm">Speak clearly. Your words will appear below.</p>
            </div>
          )}

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-3">
              Your Answer {isListening && <span className="text-red-400 ml-2">🔴 Recording...</span>}
            </label>
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={handleAnswerChange}
              disabled={submitting}
              rows="6"
              className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition"
              placeholder="Your transcribed text will appear here... or type manually"
            />
            <p className="text-gray-400 text-sm mt-2">
              {answers[currentQuestion.id]?.length || 0} characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={submitAnswer}
              disabled={submitting || !isAnswered}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : isLastQuestion ? 'Complete Interview' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
