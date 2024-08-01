import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface CustomScrollbarProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ children }) => {
  return (
		<Scrollbars className='scroll-div flex-grow' renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
		renderTrackVertical={props => <div {...props} className="track-vertical" />}
		renderView={props => <div {...props} className="scroll-content" />}>
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;
