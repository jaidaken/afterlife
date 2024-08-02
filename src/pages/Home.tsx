import React from 'react';
import Scrollbar from '../components/CustomScrollbar';
import afterlife from '/images/al-wide.gif';
import meteorShower from '/images/meteor.jpg';
import badge from '/images/sobc.png';

const Home: React.FC = () => (
	<div className='flex flex-grow justify-center  text-white'>
		<div className="w-full ">
			<Scrollbar>
				<div className='flex flex-col justify-center items-center '>
					<div className='px-32'>

						<div className="flex justify-center items-center bg-gray-700 w-screen">
							<div className="flex justify-center items-center my-4 gap-4 w-3/4 max-w-7xl">
								<img src={badge} alt="Meteor Shower" className="col-span-1" width="300" height='auto' />
								<div className="p-4 w-3/4 ">
									<h1 className="font-bold mb-4 text-4xl">Welcome to Blair County!</h1>
									<h3 className="mb-4 text-xl">Your Gateway to Natural Wonders and Unforgettable Experiences!</h3>
									<p className="mb-6">
										At the heart of West Virginia in the beautiful mountainside of the Appalachian range, Blair County is packed with rich history and heritage. Our residents are the heart and soul of our communities, bringing camaraderie and friendship to all new faces!
									</p>

								</div>
							</div>
						</div>

						<div className="flex justify-center items-center bg-gray-800 w-screen">
							<div className="flex justify-center items-center my-4 gap-4 w-3/4 max-w-7xl">
								<div className="p-4 w-3/4 ">
									<p className="mb-6">Blair County is proud to host a once-in-a-lifetime event that has captured the attention of stargazers and thrill-seekers from across the globe. The Blair County Meteor Shower promises to be an extraordinary celestial event unlike any other.</p>
									<p className="mb-6">For months, we've been planning and preparing to bring the most spectacular meteor shower ever witnessed to the good people of Blair County, and it's esteemed visitors. This event is designed to be the highlight of your decade, with planned activities and exclusive viewing spots throughout the county.</p>
									<ul className="list-disc mb-6">
										<li className="mx-8 mb-6">
											Join us for an unforgettable night at the <span className="bg-black text-white p-1 font-mono">[REDACTED]</span> Viewing Area, where you'll have a front-row seat to this cosmic display.
										</li>
										<li className="mx-8 mb-6">
											Participate in guided tours led by experts from <span className="bg-black text-white p-1 font-mono">[REDACTED]</span>, who will provide insights into the science and wonder of meteor showers.
										</li>
										<li className="mx-8 mb-6">
											Enjoy the festive atmosphere at the <span className="bg-black text-white p-1 font-mono">[REDACTED]</span> grounds, featuring live music, food vendors, and family-friendly activities.
										</li>
									</ul>
									<p className="mb-6">
										So, come visit Blair County and enrich yourselves!
									</p>
								</div>
								<img src={meteorShower} alt="Meteor Shower" className="col-span-1" width="300" height='auto' />
							</div>
						</div>

						<div className="flex justify-center items-center bg-gray-900 w-screen">
							<div className="flex flex-col justify-center items-center my-4 gap-4 w-3/4 max-w-7xl">
								<img src={afterlife} alt="Afterlife" className="mx-auto mb-4" width="full" />
								<p className="mb-4 text-center w-3/4">
									Afterlife is a Project Zomboid server focused on delivering a quality roleplay server that revels in the themes of the supernatural. With a fully customised map and no more stereotypical zombies, Afterlife prides itself on its uniqueness and is excited to welcome you in!
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
