import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Dashboard from './pages/HomePage';
import Onboarding from './features/auth/Onboarding';
import PoseTracker from './features/workout/PoseTracker';
import FoodScanner from './features/nutrition/FoodScanner';
import Leaderboard from './pages/Leaderboard';
import WorkoutLibrary from './pages/WorkoutLibrary';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AICoach from './pages/AICoach';
import ThemeWrapper from './components/ThemeWrapper';
import Layout from './components/Layout'; // Imported from your components folder

// IMPORTS FOR THE 'MORE' TAB
import MoreHub from './pages/more/MoreHub';
import WeeklyProgress from './pages/more/WeeklyProgress';
import BMICalc from './pages/more/BMICalc';
import SettingsPrivacy from './pages/more/SettingsPrivacy';

// MODULAR TRACKERS SUB-HUB IMPORTS
import GoalTracker from './pages/more/files/GoalTracker';
import HabitTracker from './pages/more/files/HabitTracker';

function App() {
  const isAuthenticated = true; 

  return (
    <ThemeWrapper>
      <Router>
        <div style={{ backgroundColor: '#0a0a0b', minHeight: '100vh' }}>
          <Routes>
            {/* 1. PUBLIC / ISOLATED ROUTES (No Navbar or Header layouts) */}
            <Route path="/" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 2. PROTECTED WRAPPER: All pages inside automatically get the Sidebar & Header tabs */}
            <Route element={<Layout><Outlet /></Layout>}>
              
              {/* Core Dashboard & Coaching Pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/coach" element={<AICoach />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workouts" element={<WorkoutLibrary />} />

              {/* AI Pose Tracker */}
              <Route path="/scanner" element={
                <div className="p-4 text-center text-white">
                  <h2 className="fw-black mb-4">AI Pose Coach</h2>
                  <PoseTracker onLogWorkout={() => console.log("Workout saved!")} />
                </div>
              } />

              {/* AI Vision Nutrition Scanner */}
              <Route path="/food-analysis" element={
                <div className="p-4">
                  <div className="text-center mb-4 text-white">
                    <h2 className="fw-black">AI Vision Scanner</h2>
                    <p className="opacity-75">Snap a photo of your meal to analyze calories</p>
                  </div>
                  <FoodScanner onUpdate={() => console.log("Nutrition data refreshed!")} />
                </div>
              } />

              {/* More Hub Links & System Pages */}
              <Route path="/more" element={<MoreHub />} />
              <Route path="/progress" element={<WeeklyProgress />} />
              <Route path="/bmi" element={<BMICalc />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<SettingsPrivacy />} />
              <Route path="/privacy" element={<SettingsPrivacy />} />
              
              {/* Tracker Plugins Sub-Hub */}
              <Route path="/goal-tracker" element={<GoalTracker theme={{ bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00' }} cardBase={{ background: '#1a1b1e', borderRadius: '30px', border: 'none', padding: '25px', color: 'white' }} showModal={(msg) => console.log(msg)} />} />
              <Route path="/habit-tracker" element={<HabitTracker theme={{ bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00' }} cardBase={{ background: '#1a1b1e', borderRadius: '30px', border: 'none', padding: '25px', color: 'white' }} />} />
            
            </Route>

            {/* Global Redirect Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </ThemeWrapper>
  );
}

export default App;