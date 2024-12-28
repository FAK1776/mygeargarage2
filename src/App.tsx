import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MyGear } from './pages/MyGear';
import { Login } from './pages/Login';
import { AddGear } from './pages/AddGear';
import { Profile } from './pages/Profile';
import { FAQ } from './components/layout/FAQ';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { useAuth } from './hooks/useAuth';
import Timeline from './pages/Timeline';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {user && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <MyGear /> : <Navigate to="/login" />} />
            <Route path="/add-gear" element={user ? <AddGear /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/timeline" element={user ? <Timeline /> : <Navigate to="/login" />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
