// src/components/ProgressBar.jsx
import React from 'react';
// Add styles for the progress bar
import './ProgressBar.css';  

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        {progress}% Paid Off
      </div>
    </div>
  );
};

export default ProgressBar;