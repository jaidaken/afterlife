import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface CustomScrollbarProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ children }) => {
	const [hideTrack, setHideTrack] = useState(false);

	useEffect(() => {
		const thumbVertical = document.querySelector('.thumb-vertical');
		setHideTrack(false);

		if (thumbVertical) {
			const observer = new ResizeObserver(() => {
				const height = thumbVertical.clientHeight;
				if (height === 0) {
					setHideTrack(true);
				} else {
					setHideTrack(false);
				}
			});

			observer.observe(thumbVertical);

			return () => {
				observer.disconnect();
			};
		}
	}, []);

	return (
		<Scrollbars
			className='scroll-div flex-grow'
			renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
			renderTrackVertical={props => <div {...props} className={`track-vertical ${hideTrack ? 'hide-track' : ''}`} />}
			renderView={props => <div {...props} className="scroll-content" />}
		>
			{children}
		</Scrollbars>
	);
};

export default CustomScrollbar;
