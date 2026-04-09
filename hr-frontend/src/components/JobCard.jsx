const JobCard = ({ job, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.domain}</p>
          <p className="text-gray-700 mt-3">{job.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {job.requirements?.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <span>📍 {job.location}</span>
            <span>💰 {job.salary}</span>
            <span className={`px-3 py-1 rounded ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {job.status}
            </span>
          </div>
        </div>
        <button onClick={() => onDelete(job._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
