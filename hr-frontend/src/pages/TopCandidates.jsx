import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';

const TopCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadTopCandidates();
  }, []);

  const loadTopCandidates = async () => {
    try {
      const response = await candidateService.getRankedCandidates();
      setCandidates(response.candidates?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-5xl">🏆</span>
            Top 10 Performers
          </h1>
          <p className="text-gray-600 mt-2">Highest ranked candidates based on comprehensive evaluation</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="px-8 py-5 text-left font-semibold">Rank</th>
                <th className="px-8 py-5 text-left font-semibold">Candidate</th>
                <th className="px-8 py-5 text-left font-semibold">Contact</th>
                <th className="px-8 py-5 text-left font-semibold">Final Score</th>
                <th className="px-8 py-5 text-left font-semibold">Status</th>
                <th className="px-8 py-5 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map((candidate, index) => (
                <tr key={candidate.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {candidate.rank}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-600">{candidate.email}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-lg shadow-md">
                      {candidate.scores.finalScore}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      candidate.screeningStatus === 'shortlisted' ? 'bg-green-100 text-green-800' :
                      candidate.screeningStatus === 'hired' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.screeningStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopCandidates;
