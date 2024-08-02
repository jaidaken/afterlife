import React from 'react';
import Scrollbar from '../components/CustomScrollbar';

const Lore: React.FC = () => {
    return (
        <div className="flex flex-grow justify-center text-white">
            <div className="flex w-5/6 bg-gray-900 ">
                <aside className="w-1/6 p-4 bg-gray-800 ">
                    <nav>
                        <ul>
                            <li><a href="#introduction" className="block py-2">Introduction</a></li>
                            <li><a href="#history" className="block py-2">History</a></li>
                            <li><a href="#characters" className="block py-2">Characters</a></li>
                            <li><a href="#world" className="block py-2">World</a></li>
                            <li><a href="#conclusion" className="block py-2">Conclusion</a></li>
                        </ul>
                    </nav>
                </aside>
                <Scrollbar>
                    <div className="p-4 bg-gray-900 ">
                        <section id="introduction" className="mb-8">
                            <h2 className="text-2xl mb-4">Introduction</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec orci fermentum, a tincidunt nisi facilisis.</p>
                        </section>
                        <section id="history" className="mb-8">
                            <h2 className="text-2xl mb-4">History</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec orci fermentum, a tincidunt nisi facilisis.</p>
                        </section>
                        <section id="characters" className="mb-8">
                            <h2 className="text-2xl mb-4">Characters</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec orci fermentum, a tincidunt nisi facilisis.</p>
                        </section>
                        <section id="world" className="mb-8">
                            <h2 className="text-2xl mb-4">World</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec orci fermentum, a tincidunt nisi facilisis.</p>
                        </section>
                        <section id="conclusion" className="mb-8">
                            <h2 className="text-2xl mb-4">Conclusion</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec orci fermentum, a tincidunt nisi facilisis.</p>
                        </section>
                    </div>
                </Scrollbar>
            </div>
        </div>
    );
};

export default Lore;
