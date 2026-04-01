import React from "react";
import "../styles/loading-spinner.css";

const LoadingSpinner = ({ 
  size = "medium", 
  text = "Loading...", 
  fullScreen = false,
  overlay = false 
}) => {
  const spinnerClass = `loading-spinner loading-spinner--${size}${overlay ? ' loading-spinner--overlay' : ''}`;
  
  const content = (
    <div className={spinnerClass}>
      <div className="loading-spinner__icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="loading-spinner__circle opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="loading-spinner__path opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      {text && (
        <p className="loading-spinner__text">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-spinner__fullscreen">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-spinner__overlay-container">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;