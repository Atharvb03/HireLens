import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';
import { jobService } from '../services/jobService';

const CandidateReport = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [candidatesRes, jobsRes] = await Promise.all([
        candidateService.getRankedCandidates(),
        jobService.getAll()
      ]);
      setCandidates(candidatesRes.candidates || []);
      setJobs(jobsRes.jobs || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const avgScore = candidates.length > 0 ? (candidates.reduce((sum, c) => sum + parseFloat(c.scores.finalScore), 0) / candidates.length).toFixed(2) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📈 Recruitment Reports</h1>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{candidates.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Average Score</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{avgScore}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Active Jobs</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">{jobs.length}</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateReport;
