import { useState, useEffect } from 'react';
import { useGetWakeUpTime } from './useQueries';

interface WakeUpTimerState {
  isLate: boolean;
  minutesLate: number;
  currentTime: string;
  targetTime: string;
  isEnabled: boolean;
}

export function useWakeUpTimer(): WakeUpTimerState {
  const { data: settings } = useGetWakeUpTime();
  const [currentTime, setCurrentTime] = useState('');
  const [isLate, setIsLate] = useState(false);
  const [minutesLate, setMinutesLate] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );

      if (settings && settings.isEnabled) {
        const targetDate = new Date(Number(settings.wakeUpTime) / 1000000);
        const target = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          targetDate.getHours(),
          targetDate.getMinutes()
        );

        if (now > target) {
          const diffMs = now.getTime() - target.getTime();
          const diffMinutes = Math.floor(diffMs / 60000);
          setIsLate(true);
          setMinutesLate(diffMinutes);
        } else {
          setIsLate(false);
          setMinutesLate(0);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [settings]);

  const targetTime = settings
    ? new Date(Number(settings.wakeUpTime) / 1000000).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return {
    isLate,
    minutesLate,
    currentTime,
    targetTime,
    isEnabled: settings?.isEnabled ?? false,
  };
}
