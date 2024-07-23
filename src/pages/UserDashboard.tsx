// frontend/src/pages/UserDashboard.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <h1 className="text-gray-300">Please log in to view your dashboard.</h1>;
  }

  return (
    <div className="text-gray-300">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <UserProfile user={user} />
      <p>This is the user dashboard, visible only to logged-in users.</p>
    </div>
  );
};

export default UserDashboard;
