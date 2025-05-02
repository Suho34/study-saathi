// src/components/ui/Loading.jsx
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="flex items-center justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-100/80 blur-xl"></div>
          <BookOpen className="h-16 w-16 text-indigo-600 relative z-10" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
      >
        <p className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">
          StudySaathi taiyar kar raha hai...
        </p>
      </motion.div>
    </motion.div>
  );
}
