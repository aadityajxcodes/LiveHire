import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CompanyLogin from './pages/CompanyLogin';
// import CompanySignup from './pages/CompanySignup';
import InterviewerLogin from './pages/InterviewerLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import InterviewerDashboard from './pages/InterviewerDashboard';
import NotFound from './pages/Notfound';
import LoginSelection from './pages/LoginSelection';
import CompanySignup from './pages/CompanySignup'; // New Signup Page
import InterviewerSignup from './pages/InterviewerSignup';
import ScheduleInterview from './pages/ScheduleInterview'; // New Schedule Interview Page

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interviewer-signup" element={<InterviewerSignup />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/interviewer-login" element={<InterviewerLogin />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/interviewer-dashboard" element={<InterviewerDashboard />} />
        <Route path="/company-signup" element={<CompanySignup />} /> {/* New Signup Page */}
        <Route path="/schedule-interview" element={<ScheduleInterview />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;