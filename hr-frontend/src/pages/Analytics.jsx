import { useState, useEffect } from 'react';
import api from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalApplicants: 0,
    passedAIRound: 0,
    avgInterviewScore: 0,
    domainWise: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [candidatesRes, jobsRes] = await Promise.all([
        api.get('/candidates/ranking'),
        api.get('/jobs')
      ]);

      const candidates = candidatesRes.data.candidates || [];
      const jobs = jobsRes.data.jobs || [];

      const passedAI = candidates.filter(c => c.scores.aiScore >= 70).length;
      const avgInterview = candidates.length > 0 
        ? (candidates.reduce((sum, c) => sum + (c.scores.interviewScore || 0), 0) / candidates.length).toFixed(2)
        : 0;

      const domainMap = {};
      jobs.forEach(job => {
        const domain = job.domain || 'Other';
        const count = candidates.filter(c => c.appliedJob?._id === job._id).length;
        if (domainMap[domain]) {
          domainMap[domain] += count;
        } else {
          domainMap[domain] = count;
        }
      });

      const domainWise = Object.entries(domainMap).map(([domain, count]) => ({ domain, count }));

      setAnalytics({
        totalApplicants: candidates.length,
        passedAIRound: passedAI,
        avgInterviewScore: avgInterview,
        domainWise
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Analytics Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Applicants</h3>
          <p className="text-5xl font-bold">{analytics.totalApplicants}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Passed AI Round</h3>
          <p className="text-5xl font-bold">{analytics.passedAIRound}</p>
          <p className="text-sm mt-2 opacity-90">AI Score ≥ 70</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Avg Interview Score</h3>
          <p className="text-5xl font-bold">{analytics.avgInterviewScore}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Domain-wise Applicants</h2>
        <div className="space-y-4">
          {analytics.domainWise.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-48 font-semibold text-gray-700">{item.domain}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3 text-white font-bold"
                  style={{ width: `${Math.min((item.count / analytics.totalApplicants) * 100, 100)}%` }}
                >
                  {item.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
