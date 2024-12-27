import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MyGear } from './pages/MyGear';
import { Login } from './pages/Login';
import { AddGear } from './pages/AddGear';
import { Navbar } from './components/layout/Navbar';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <MyGear /> : <Navigate to="/login" />} />
        <Route path="/add-gear" element={user ? <AddGear /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
