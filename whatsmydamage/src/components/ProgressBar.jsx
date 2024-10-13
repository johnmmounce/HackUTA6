// src/components/ProgressBar.jsx
import React from 'react';
<<<<<<< HEAD
// Add styles for the progress bar
import './ProgressBar.css';  
=======
import './ProgressBar.css';  // Add styles for the progress bar
>>>>>>> maysa

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