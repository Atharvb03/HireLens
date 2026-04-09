import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';
import CandidateTable from '../components/CandidateTable';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCandidates();
  }, [filter]);

  const loadCandidates = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await candidateService.getRankedCandidates(params);
      setCandidates(response.candidates || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Candidates</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>
      <CandidateTable candidates={candidates} onUpdate={loadCandidates} />
    </div>
  );
};

export default CandidateList;
