import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const data = await candidateService.getAll();
    setCandidates(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Candidates</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate._id} className="border-t">
                <td className="px-6 py-4">{candidate.name}</td>
                <td className="px-6 py-4">{candidate.email}</td>
                <td className="px-6 py-4">{candidate.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Candidates;
