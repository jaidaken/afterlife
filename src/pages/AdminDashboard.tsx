import React from 'react';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (user: any) => user && user.isAdmin;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <h1 className="text-gray-300">Please log in to view the admin dashboard.</h1>;
  }

  if (!isAdmin(user)) {
    return <h1 className="text-gray-300">You do not have access to the admin dashboard.</h1>;
  }

  return (
    <div className="text-gray-300">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>This is the admin dashboard, visible only to admin users.</p>
    </div>
  );
};

export default AdminDashboard;
