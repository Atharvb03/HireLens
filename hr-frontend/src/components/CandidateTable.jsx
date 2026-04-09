const CandidateTable = ({ candidates, onUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Rank</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">AI Score</th>
            <th className="px-6 py-3 text-left">Interview</th>
            <th className="px-6 py-3 text-left">Technical</th>
            <th className="px-6 py-3 text-left">Final Score</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4 font-bold">{candidate.rank}</td>
              <td className="px-6 py-4">{candidate.name}</td>
              <td className="px-6 py-4">{candidate.email}</td>
              <td className="px-6 py-4">{candidate.scores.aiScore}</td>
              <td className="px-6 py-4">{candidate.scores.interviewScore}</td>
              <td className="px-6 py-4">{candidate.scores.technicalScore}</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">{candidate.scores.finalScore}</span></td>
              <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${candidate.screeningStatus === 'shortlisted' ? 'bg-blue-100 text-blue-800' : candidate.screeningStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{candidate.screeningStatus}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
