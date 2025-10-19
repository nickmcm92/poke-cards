import React from 'react';
import { WorkButton } from '../components/WorkButton';
import { useStore } from '../store';
import './TestPage.css';

export function TestPage() {
  const money = useStore(state => state.player.money);

  return (
    <div className="test-page">
      <h1>Test Page</h1>
      <div className="stats">
        <p>Current Money: {money} coins</p>
      </div>
      <div className="controls">
        <WorkButton />
      </div>
    </div>
  );
}