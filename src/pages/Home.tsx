import React from 'react';
import Scrollbar from '../components/CustomScrollbar';
import afterlife from '/images/al-sm.gif';
import meteorShower from '/images/meteor.jpg';

const Home: React.FC = () => (
	<div className='flex flex-grow justify-center text-white'>
		<div className="w-full bg-gray-900 ">
			<Scrollbar>
				<div className='flex flex-col justify-center items-center '>

					<div className="flex flex-col justify-center items-center py-4 px-32 bg-gray-900 ">
						<img src={afterlife} alt="Afterlife" className="mx-auto mb-4" width="200" height="auto" />
						<p className="mb-4 text-center w-3/4">
							Afterlife is a Project Zomboid server focused on delivering a quality roleplay server that revels in the themes of the supernatural. With a fully customised map and no more stereotypical zombies, Afterlife prides itself on its uniqueness and is excited to welcome you in!
						</p>
					</div>

					<div className='py-4 px-32 bg-gray-800'>
						<div className="flex justify-center items-start mb-4 gap-4">
							<img src={meteorShower} alt="Meteor Shower" className="col-span-1" width="300" height='auto' />
							<div className="p-4 w-2/4 ">
								<h1 className="font-bold mb-4 text-4xl">Welcome to Blair County!</h1>
								<p className="mb-6">
									At the heart of West Virginia in the beautiful mountainside of the Appalachian range, packed full with rich history and heritage, what is there to miss? Our residents are the heart and soul of our communities, friendly to all new faces! Especially with the upcoming Meteor Shower that is attracting people from ALL over the world!
								</p>
								<p className="mb-6">
									Not interested in Meteor Showers? Take a tour around our forests to <span className="bg-black text-white px-1 font-mono">[REDACTED]</span> or what about the mines to explore our rich heritage and <span className="bg-black text-white px-1 font-mono">[REDACTED]</span>
								</p>
								<p className="mb-6">
									So, come visit Blair County and enrich yourselves!
								</p>
							</div>
						</div>

					</div>
				</div>
			</Scrollbar>
		</div>
	</div>
);

export default Home;
