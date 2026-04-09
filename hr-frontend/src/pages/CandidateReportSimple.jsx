import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const CandidateReportSimple = () => {
  const { candidateId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, [candidateId]);

  const loadReport = async () => {
    try {
      const { data } = await api.get(`/reports/${candidateId}`);
      setReport(data.report);
    } catch (error) {
      console.error('Error loading report:', error);
    }
  };

  if (!report) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📋 Candidate Report</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <h2 className="text-xl font-bold mb-3 text-blue-600">Interview Transcript</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{report.interviewTranscript || 'No transcript available'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow-lg p-6"><h3 className="font-bold text-lg mb-2">Technical Score</h3><p className="text-3xl font-bold text-green-600">{report.technicalScore || 0}</p></div>
        <div className="bg-white rounded-lg shadow-lg p-6"><h3 className="font-bold text-lg mb-2">Behavioral Score</h3><p className="text-3xl font-bold text-purple-600">{report.behavioralScore || 0}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow-lg p-6"><h3 className="font-bold text-lg mb-2 text-green-600">✅ Strengths</h3><ul className="list-disc list-inside">{report.strengths?.map((s, i) => <li key={i} className="text-gray-700">{s}</li>)}</ul></div>
        <div className="bg-white rounded-lg shadow-lg p-6"><h3 className="font-bold text-lg mb-2 text-red-600">⚠️ Weaknesses</h3><ul className="list-disc list-inside">{report.weaknesses?.map((w, i) => <li key={i} className="text-gray-700">{w}</li>)}</ul></div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-xl mb-3">🤖 AI Recommendation</h3>
        <p className="text-lg">{report.aiRecommendation || 'No recommendation available'}</p>
      </div>
    </div>
  );
};

export default CandidateReportSimple;
