import React from 'react';

interface SkillLevelProps {
  level: number;
}

const SkillLevel: React.FC<SkillLevelProps> = ({ level }) => {
  const squares = Array.from({ length: 10 }, (_, i) => (
    <span
      key={i}
      className={`w-3 h-3 m-0.5 outline outline-1 ${
        i < level ? 'bg-red-500' : 'bg-transparent'
      } `}
    />
  ));

  return <div className="flex font-zomboidSans">{squares}</div>;
};

export default SkillLevel;
