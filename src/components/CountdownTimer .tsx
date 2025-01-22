import React, { useState, useEffect } from "react";
import TimeIcon from "@rsuite/icons/Time";

interface CountdownTimerProps {
  startTime: string; // Accepts a string in a valid date format
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Remaining time in seconds
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  useEffect(() => {
    const startDate = new Date(startTime).getTime();
    const targetDate = startDate + 20 * 60 * 1000; // Add 20 minutes in milliseconds

    const calculateTimeLeft = (): number => {
      const currentTime = new Date().getTime();
      const difference = targetDate - currentTime;

      if (difference <= 0) {
        setIsTimedOut(true);
        return 0;
      }

      return Math.floor(difference / 1000); // Convert milliseconds to seconds
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex  w-full items-center justify-center h-full ${
        isTimedOut ? "bg-red-400" : "bg-gray-100"
      } `}
    >
      <div
        className={`py-2 ${
          isTimedOut ? "" : "py-0"
        }text-lg sm:text-sm  font-bold text-gray-800 flex items-center justify-center gap-2`}
      >
        {isTimedOut ? <TimeIcon /> : ""}
        {isTimedOut ? "עבר זמן החתמה" : ` זמן נותר ${formatTime(timeLeft)}`}
      </div>
      {!isTimedOut && (
        <div className="mt-4 text-sm text-gray-600">
          {/* Time remaining to complete your action. */}
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
