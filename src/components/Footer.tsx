import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 sticky bottom-0 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p>&copy; {new Date().getFullYear()} AfterLife RP. All rights reserved.</p>
        </div>
        <div>
          <button
            onClick={() => window.open('https://discord.gg/your-discord-server', '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Join our Discord
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
