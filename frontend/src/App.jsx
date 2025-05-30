import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import './global.css';

// Pages
import Home from './pages/Home';
import LoginSelection from './pages/LoginSelection';
import CompanyLogin from './pages/CompanyLogin';
import CompanySignup from './pages/CompanySignup';
import InterviewerLogin from './pages/InterviewerLogin';
import InterviewerSignup from './pages/InterviewerSignup';
import CompanyDashboard from './pages/CompanyDashboard';
import InterviewerDashboard from './pages/InterviewerDashboard';
import NotFound from './pages/NotFound';
import InterviewDetails from './pages/InterviewDetails';
import LiveInterview from './pages/LiveInterview';
import ScheduleInterview from './pages/ScheduleInterview';
import InterviewReport from './pages/InterviewReport';
import VideoCallPrep from './pages/VideoCallPrep';
import UserProfile from './pages/UserProfile';
import PaymentPage from './pages/PaymentPage';
import InterviewerList from './pages/InterviewerList';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { WebRTCProvider } from './contexts/WebRTCContext';
import { CodeEditorProvider } from './contexts/CodeEditorContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0057b7',
    },
    secondary: {
      main: '#ffd700',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WebRTCProvider>
          <CodeEditorProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login-selection" element={<LoginSelection />} />
                <Route path="/company-login" element={<CompanyLogin />} />
                <Route path="/company-signup" element={<CompanySignup />} />
                <Route path="/interviewer-login" element={<InterviewerLogin />} />
                <Route path="/interviewer-signup" element={<InterviewerSignup />} />
                
                {/* Protected Routes - Company */}
                <Route 
                  path="/company-dashboard" 
                  element={
                    <ProtectedRoute userType="company" redirectPath="/company-login">
                      <CompanyDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/schedule-interview" 
                  element={
                    <ProtectedRoute userType="company" redirectPath="/company-login">
                      <ScheduleInterview />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Routes - Interviewer */}
                <Route 
                  path="/interviewer-dashboard" 
                  element={
                    <ProtectedRoute userType="interviewer" redirectPath="/interviewer-login">
                      <InterviewerDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/interviewer/profile" 
                  element={
                    <ProtectedRoute userType="interviewer" redirectPath="/interviewer-login">
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Routes - Both */}
                <Route 
                  path="/interview-details/:id" 
                  element={
                    <ProtectedRoute userType="both" redirectPath="/login-selection">
                      <InterviewDetails />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/interview-report/:id" 
                  element={
                    <ProtectedRoute userType="both" redirectPath="/login-selection">
                      <InterviewReport />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/payment/:interviewId" 
                  element={
                    <ProtectedRoute userType="company" redirectPath="/company-login">
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Interview Room Routes */}
                <Route 
                  path="/interview/:interviewId/setup" 
                  element={
                    <ProtectedRoute userType="both" redirectPath="/login-selection">
                      <VideoCallPrep />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/interview/:interviewId/live" 
                  element={
                    <ProtectedRoute userType="both" redirectPath="/login-selection">
                      <LiveInterview />
                    </ProtectedRoute>
                  }
                />
                
                {/* Legacy URL Redirects */}
                <Route 
                  path="/live-interview/:roomId" 
                  element={<Navigate to={location => `/interview/${location.pathname.split('/live-interview/')[1]}/live`} replace />}
                />
                
                <Route 
                  path="/prepare-interview/:roomId" 
                  element={<Navigate to={location => `/interview/${location.pathname.split('/prepare-interview/')[1]}/setup`} replace />}
                />
                
                {/* Dashboard Redirect */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute userType="both" redirectPath="/login-selection">
                      {({ user }) => (
                        user?.type === 'company' ? 
                          <Navigate to="/company-dashboard" replace /> : 
                          <Navigate to="/interviewer-dashboard" replace />
                      )}
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/interviewer-list" 
                  element={<InterviewerList />}
                />
                
                {/* 404 - Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </CodeEditorProvider>
        </WebRTCProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;