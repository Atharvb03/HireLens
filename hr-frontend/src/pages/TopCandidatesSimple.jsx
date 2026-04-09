import { useState, useEffect } from 'react';
import api from '../services/api';

const TopCandidatesSimple = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadTopCandidates();
  }, []);

  const loadTopCandidates = async () => {
    try {
      const { data } = await api.get('/candidates/ranking');
      setCandidates(data.candidates?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const viewReport = (candidate) => {
    alert(`Report for ${candidate.name}\nFinal Score: ${candidate.scores.finalScore}\nAI: ${candidate.scores.aiScore} | Interview: ${candidate.scores.interviewScore} | Technical: ${candidate.scores.technicalScore}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🏆 Top 10 Ranked Candidates</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Final Score</th>
              <th className="px-6 py-4 text-left">Resume</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-xl text-blue-600">{candidate.rank}</td>
                <td className="px-6 py-4 font-semibold">{candidate.name}</td>
                <td className="px-6 py-4">{candidate.email}</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-lg">{candidate.scores.finalScore}</span></td>
                <td className="px-6 py-4"><a href={candidate.resumeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">View Resume</a></td>
                <td className="px-6 py-4"><button onClick={() => viewReport(candidate)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">View Report</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCandidatesSimple;
