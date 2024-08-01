import React from 'react';
import Scrollbar from '../components/CustomScrollbar';

const Home: React.FC = () => (
	<Scrollbar>
		<div className="text-center my-8 text-gray-300">
			<h1 className="text-4xl font-bold mb-4">Welcome to MyApp</h1>
			<p className="text-xl">This is the home page.</p>
		</div>
	</Scrollbar>
);

export default Home;
