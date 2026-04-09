import { useState, useEffect } from 'react';
import api from '../services/api';

const CandidateListSimple = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const { data } = await api.get('/candidates/ranking');
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidate List</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Resume</th>
              <th className="px-6 py-3 text-left">Job Applied</th>
              <th className="px-6 py-3 text-left">AI Score</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{candidate.name}</td>
                <td className="px-6 py-4">{candidate.email}</td>
                <td className="px-6 py-4"><a href={candidate.resumeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></td>
                <td className="px-6 py-4">{candidate.appliedJob?.jobTitle || 'N/A'}</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">{candidate.scores?.aiScore || 0}</span></td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${candidate.screeningStatus === 'shortlisted' ? 'bg-green-100 text-green-800' : candidate.screeningStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{candidate.screeningStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateListSimple;
