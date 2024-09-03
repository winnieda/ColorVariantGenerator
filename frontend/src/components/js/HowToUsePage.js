import React from 'react';
import TutorialEntry from './TutorialEntry';
import tutorialData from '../json/Tutorial.json';
import '../css/HowToUsePage.css';

const HowToUsePage = () => {
  return (
    <div className="how-to-use-page">
      {tutorialData.map((item, index) => (
        <TutorialEntry
          key={index}
          title={item.title}
          img={item.img}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default HowToUsePage;
