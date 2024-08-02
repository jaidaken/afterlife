import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-800 text-white fixed bottom-0 p-2 w-full">
			<div className="container mx-auto flex justify-between items-center">
				<div>
					<p>&copy; {new Date().getFullYear()} AfterLife RP. All rights reserved.</p>
				</div>
				<div>
					<button
						onClick={() => window.open('https://discord.gg/your-discord-server', '_blank')}
						className="bg-discordColor text-white px-2 py-1 rounded hover:bg-blue-700 transition"
					>
						Discord
					</button>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
