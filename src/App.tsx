import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CharactersList from './pages/CharactersList';
import CharacterDetail from './pages/CharacterDetail';
import EditCharacter from './pages/EditCharacter'; // Import EditCharacter
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <NavBar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/characters" element={<CharactersList />} />
          <Route path="/character/:name" element={<CharacterDetail />} />
          <Route path="/character/edit/:id" element={<EditCharacter />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
