import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await jobService.getAll();
    setJobs(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Jobs</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <span className="inline-block mt-4 px-3 py-1 bg-green-100 text-green-800 rounded">
              {job.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
