import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import tutorialContent from '../md/tutorial.md';

const HowToUsePage = () => {
    console.log('Checkpoint 1');
    return (
        <div className="how-to-use-page">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{tutorialContent}</ReactMarkdown>
        </div>
    );
};

export default HowToUsePage;