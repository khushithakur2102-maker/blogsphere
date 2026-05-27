import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostView from './pages/PostView';
import Editor from './pages/Editor';
import Profile from './pages/Profile';

// Scroll to top on route change (Optional but good UX)
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-primary-100">
      <Navbar />
      <main className="pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/posts/new" element={user ? <Editor /> : <Navigate to="/login" />} />
          <Route path="/posts/:id/edit" element={user ? <Editor /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
