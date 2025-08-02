import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import LandingPage from './pages/LandingPage';
import StudyPlanner from './pages/StudyPlanner';
import UploadNotes from './pages/UploadNotes';
import YouTubeNotes from './pages/YouTubeNotes';
import NotesHistory from './pages/NotesHistory';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Don't show navbar and footer on login, signup, or landing page when not logged in
  const shouldHideNavbar = !user && (
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/'
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route 
            path="/planner" 
            element={
              <ProtectedRoute>
                <StudyPlanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadNotes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/youtube-notes" 
            element={
              <ProtectedRoute>
                <YouTubeNotes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes-history" 
            element={
              <ProtectedRoute>
                <NotesHistory />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </main>
      {!shouldHideNavbar && <Footer />}
      {user && <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;