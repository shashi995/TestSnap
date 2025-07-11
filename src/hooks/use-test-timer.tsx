import { useState, useEffect, useRef } from "react";

type UseTestTimerProps = {
  started: boolean;
  startTime: string | null;
  durationInMinutes: number;
  onTwoMinutesLeft?: () => void;
  onComplete?: () => void;
};

const useTestTimer = ({
  started,
  startTime,
  durationInMinutes,
  onTwoMinutesLeft,
  onComplete,
}: UseTestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  const hasCalledTwoMinRef = useRef(false);
  const hasCalledCompleteRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!started || !startTime) {
      setTimeLeft("");
      return;
    }

    const parsedStartTime = new Date(startTime);
    const endTime = new Date(
      parsedStartTime.getTime() + durationInMinutes * 60000
    );

    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diffMs = endTime.getTime() - now.getTime();

      const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );

      if (totalSeconds <= 120 && !hasCalledTwoMinRef.current) {
        hasCalledTwoMinRef.current = true;
        onTwoMinutesLeft?.();
      }

      if (totalSeconds === 0 && !hasCalledCompleteRef.current) {
        hasCalledCompleteRef.current = true;
        clearInterval(intervalRef.current!);
        onComplete?.();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [started, startTime, durationInMinutes, onTwoMinutesLeft, onComplete]);

  return timeLeft;
};

export default useTestTimer;
