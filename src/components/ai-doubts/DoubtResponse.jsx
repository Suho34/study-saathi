const DoubtResponse = ({ chat }) => {
  return (
    <div className="mt-6 space-y-5 max-w-3xl mx-auto">
      {/* User's Question - Adjusted for layered background */}
      <div className="bg-white/90 dark:bg-slate-800/90 p-5 rounded-xl lg:rounded-2xl shadow-lg shadow-slate-400/20 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 transition-transform duration-200 ease-out hover:-translate-y-0.5">
        {" "}
        {/* Added opacity, adjusted shadow/border for context */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center ring-1 ring-indigo-100 dark:ring-indigo-700 shadow-sm">
            <span className="text-white font-semibold text-sm">Y</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1.5">
              Tumhara Sawaal:
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {chat.question}
            </p>
          </div>
        </div>
      </div>

      {/* AI Response - Adjusted for layered background */}
      {/* Removed backdrop-blur here, using opacity on gradient */}
      <div className="bg-gradient-to-br from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/70 dark:to-purple-900/70 p-5 rounded-xl lg:rounded-2xl shadow-xl shadow-indigo-500/20 dark:shadow-indigo-950/30 border border-indigo-200/40 dark:border-indigo-700/50 transition-transform duration-200 ease-out hover:-translate-y-0.5">
        {" "}
        {/* Adjusted opacity, shadow, border */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center ring-1 ring-indigo-300/50 dark:ring-indigo-600 shadow-sm">
            <span className="text-indigo-800 dark:text-indigo-100 font-semibold text-sm">
              S
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1.5">
              StudySaathi ka Jawab:
            </h3>
            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {chat.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtResponse;
