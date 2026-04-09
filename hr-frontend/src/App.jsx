import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLogin from './pages/Login';
import AdminSignup from './pages/AdminSignup';
import Dashboard from './pages/Dashboard';
import JobManagement from './pages/JobManagement';
import CandidateList from './pages/CandidateList';
import TopCandidates from './pages/TopCandidates';
import CandidateReport from './pages/CandidateReport';
import Analytics from './pages/Analytics';

// Removed authentication - direct access to dashboard
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="candidates" element={<CandidateList />} />
          <Route path="top-ranked" element={<TopCandidates />} />
          <Route path="reports" element={<CandidateReport />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
