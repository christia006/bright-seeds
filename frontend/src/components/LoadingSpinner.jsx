import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{marginLeft: '10px', color: '#666'}}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;