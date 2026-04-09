import { useState, useEffect } from 'react';
import api from '../services/api';

const JobManagementSimple = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ jobTitle: '', domain: '', jobDescription: '', requiredSkills: '', experienceLevel: 'Mid', location: '', salaryRange: '' });

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    const { data } = await api.get('/jobs');
    setJobs(data.jobs || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/jobs/create', { ...form, requiredSkills: form.requiredSkills.split(',').map(s => s.trim()) });
    setForm({ jobTitle: '', domain: '', jobDescription: '', requiredSkills: '', experienceLevel: 'Mid', location: '', salaryRange: '' });
    loadJobs();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      await api.delete(`/jobs/${id}`);
      loadJobs();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Management</h1>
      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-3">
        <input placeholder="Job Title" className="p-2 border rounded" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} required />
        <input placeholder="Domain" className="p-2 border rounded" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required />
        <input placeholder="Skills (comma separated)" className="p-2 border rounded" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} required />
        <input placeholder="Location" className="p-2 border rounded" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input placeholder="Salary Range" className="p-2 border rounded" value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Post Job</button>
      </form>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 text-white"><tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Domain</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Action</th></tr></thead>
          <tbody>{jobs.map((job) => (<tr key={job._id} className="border-t"><td className="p-3">{job.jobTitle}</td><td className="p-3">{job.domain}</td><td className="p-3">{job.location}</td><td className="p-3"><button onClick={() => handleDelete(job._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagementSimple;
