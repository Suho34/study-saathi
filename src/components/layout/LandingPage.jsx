import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 px-6 py-10">
      <motion.div
        className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Study Saathi
        </h1>
        <h4 className="text-4xl font-extrabold text-white mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
          Tera Apna Study Dost – Smart bhi, Desi bhi!
        </h4>
        <p className="text-lg text-white mb-6 max-w-md backdrop-blur-sm bg-white/10 p-4 rounded-lg">
          Personalized Hinglish learning to help you succeed. Tailored study
          plans, interactive tools, and AI-powered support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 text-center shadow-lg"
          >
            Padhai Shuru Karein?
          </Link>
          <Link
            to="/login"
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-center shadow-lg"
          >
            Already Registered? Login Karein
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
