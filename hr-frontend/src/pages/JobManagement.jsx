import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import JobForm from '../components/JobForm';
import JobCard from '../components/JobCard';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobService.getAll();
      setJobs(response.jobs || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.delete(id);
        loadJobs();
      } catch (error) {
        alert('Error deleting job');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>
      {showForm && <JobForm onSuccess={() => { setShowForm(false); loadJobs(); }} />}
      <div className="grid gap-4 mt-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default JobManagement;
