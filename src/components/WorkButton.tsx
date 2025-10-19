import React from 'react';
import { useWorkButton } from '../hooks/useWorkButton';
import './WorkButton.css';

function WorkButtonComponent() {
  const { 
    isWorking = false, 
    progress = 0, 
    startWork = () => {}, 
    canWork = false, 
    earnings = 0 
  } = useWorkButton() ?? {
    isWorking: false,
    progress: 0,
    startWork: () => {},
    canWork: false,
    earnings: 0
  };
  
  return (
    <div className="work-button-container">
      <button
        className={`work-button ${isWorking ? 'working' : ''}`}
        onClick={() => startWork()}
        disabled={!canWork}
      >
        <div className="work-button-content">
          <span className="work-text">Work</span>
          {isWorking && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </button>
      {(typeof earnings === 'number' && earnings > 0) && (
        <div className="earnings-popup">
          +{earnings} coins
        </div>
      )}
    </div>
  );
}

export const WorkButton = React.memo(WorkButtonComponent);