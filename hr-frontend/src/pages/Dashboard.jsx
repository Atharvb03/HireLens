import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, totalCandidates: 0, shortlisted: 0, pending: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        jobService.getAll(),
        candidateService.getRankedCandidates()
      ]);
      
      setStats({
        totalJobs: jobsRes.count || 0,
        totalCandidates: candidatesRes.count || 0,
        shortlisted: candidatesRes.candidates?.filter(c => c.screeningStatus === 'shortlisted').length || 0,
        pending: candidatesRes.candidates?.filter(c => c.screeningStatus === 'pending').length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    { title: 'Total Jobs Posted', value: stats.totalJobs, icon: '💼', color: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Total Candidates', value: stats.totalCandidates, icon: '👥', color: 'from-green-500 to-green-600', change: '+8%' },
    { title: 'Shortlisted', value: stats.shortlisted, icon: '✅', color: 'from-purple-500 to-purple-600', change: '+15%' },
    { title: 'Pending Review', value: stats.pending, icon: '⏳', color: 'from-orange-500 to-orange-600', change: '-5%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your recruitment today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {i}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">New candidate applied</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
              <span className="text-2xl mb-2 block">➕</span>
              <span className="text-sm font-semibold">Post New Job</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all">
              <span className="text-2xl mb-2 block">👤</span>
              <span className="text-sm font-semibold">Add Candidate</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
              <span className="text-2xl mb-2 block">📊</span>
              <span className="text-sm font-semibold">View Reports</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all">
              <span className="text-2xl mb-2 block">⚙️</span>
              <span className="text-sm font-semibold">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
