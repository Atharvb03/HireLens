import { useState } from 'react';
import { jobService } from '../services/jobService';

const JobForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    jobTitle: '', domain: '', jobDescription: '', requiredSkills: '', experienceLevel: 'Mid', location: '', salaryRange: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobService.create({
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
      });
      alert('Job posted successfully!');
      onSuccess();
    } catch (error) {
      alert('Error posting job');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Job Title" className="p-3 border rounded" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required />
        <input type="text" placeholder="Domain" className="p-3 border rounded" value={formData.domain} onChange={(e) => setFormData({ ...formData, domain: e.target.value })} required />
        <textarea placeholder="Job Description" className="p-3 border rounded col-span-2" rows="3" value={formData.jobDescription} onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })} required />
        <input type="text" placeholder="Skills (comma separated)" className="p-3 border rounded" value={formData.requiredSkills} onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })} required />
        <select className="p-3 border rounded" value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </select>
        <input type="text" placeholder="Location" className="p-3 border rounded" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
        <input type="text" placeholder="Salary Range" className="p-3 border rounded" value={formData.salaryRange} onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })} required />
      </div>
      <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Post Job</button>
    </form>
  );
};

export default JobForm;
