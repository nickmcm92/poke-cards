import { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '../store';

interface UseWorkButtonReturn {
  isWorking: boolean;
  progress: number;
  canWork: boolean;
  startWork: () => void;
  earnings: number | null;
}

export const useWorkButton = (): UseWorkButtonReturn => {
  const { settings, addMoney } = useStore();
  const [isWorking, setIsWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [earnings, setEarnings] = useState<number | null>(null);
  const progressInterval = useRef<number | null>(null);
  const earningsTimeout = useRef<number | null>(null);

  // Cleanup function for intervals and timeouts
  const cleanup = useCallback(() => {
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    if (earningsTimeout.current) {
      window.clearTimeout(earningsTimeout.current);
      earningsTimeout.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startWork = useCallback(() => {
    if (isWorking) return;

    setIsWorking(true);
    setProgress(0);
    setEarnings(null);

    // Update progress every 100ms
    const updateInterval = 100;
    const steps = settings.workCooldown / updateInterval;
    let currentStep = 0;

    progressInterval.current = window.setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      
      if (newProgress >= 100) {
        cleanup();
        setProgress(100);
        setIsWorking(false);
        addMoney(settings.workReward);
        setEarnings(settings.workReward);

        // Clear earnings display after 2 seconds
        earningsTimeout.current = window.setTimeout(() => {
          setEarnings(null);
        }, 2000);
      } else {
        setProgress(newProgress);
      }
    }, updateInterval);
  }, [isWorking, settings.workCooldown, settings.workReward, addMoney, cleanup]);

  return {
    isWorking,
    progress,
    canWork: !isWorking,
    startWork,
    earnings
  };
};