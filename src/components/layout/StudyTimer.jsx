import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState("study");
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            audioRef.current.play();
            setSessionType(sessionType === "study" ? "break" : "study");
            setMinutes(sessionType === "study" ? 5 : 25);
            setSeconds(0);
            setIsActive(false);
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, sessionType]);

  const sessionColors = {
    study: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      button: "bg-indigo-600 hover:bg-indigo-700",
      ring: "ring-indigo-500",
      progress: "stroke-indigo-600",
    },
    break: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      button: "bg-emerald-600 hover:bg-emerald-700",
      ring: "ring-emerald-500",
      progress: "stroke-emerald-600",
    },
  };

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  const totalSeconds = sessionType === "study" ? 25 * 60 : 5 * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progressPercentage =
    ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progressStroke =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <div
      className={`p-8 rounded-3xl shadow-lg ${sessionColors[sessionType].bg} transition-colors duration-500 max-w-4xl mx-auto`}
    >
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Pomodoro Timer
      </motion.h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Circular Timer */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              strokeWidth="10"
              className={sessionColors[sessionType].progress}
              strokeDasharray={circumference}
              strokeDashoffset={progressStroke}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute text-4xl font-bold text-gray-700">
            {formattedTime}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="w-full lg:w-1/2 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={sessionType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.p
                className={`text-lg font-medium mb-2 ${sessionColors[sessionType].text}`}
              >
                {sessionType === "study" ? "Focus Time" : "Break Time"}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(!isActive)}
              className={`px-8 py-3 rounded-xl text-white font-bold text-lg ${sessionColors[sessionType].button} shadow-lg transition-colors`}
            >
              {isActive ? "Pause" : "Start"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsActive(false);
                setMinutes(sessionType === "study" ? 25 : 5);
                setSeconds(0);
              }}
              className="px-8 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-lg shadow-lg transition-colors"
            >
              Reset
            </motion.button>
          </div>

          {/* Session Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <motion.button
                type="button"
                onClick={() => {
                  if (sessionType !== "study") {
                    setSessionType("study");
                    setMinutes(25);
                    setSeconds(0);
                    setIsActive(false);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  sessionType === "study"
                    ? `${sessionColors.study.bg} ${sessionColors.study.text} ring-2 ${sessionColors.study.ring}`
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Study (25:00)
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  if (sessionType !== "break") {
                    setSessionType("break");
                    setMinutes(5);
                    setSeconds(0);
                    setIsActive(false);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  sessionType === "break"
                    ? `${sessionColors.break.bg} ${sessionColors.break.text} ring-2 ${sessionColors.break.ring}`
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Break (05:00)
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-600">
          {isActive ? (
            <motion.span
              animate={{
                color: ["#4f46e5", "#10b981"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Timer is running...
            </motion.span>
          ) : (
            "Timer is paused"
          )}
        </p>
      </motion.div>
    </div>
  );
}
