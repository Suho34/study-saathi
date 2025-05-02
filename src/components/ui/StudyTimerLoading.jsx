export const StudyTimerLoading = () => (
  <div className="p-8 rounded-3xl shadow-lg bg-indigo-50 max-w-4xl mx-auto animate-pulse">
    <div className="h-12 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>

    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="h-40 w-40 bg-gray-200 rounded-full"></div>
      </div>

      <div className="w-full lg:w-1/2 space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-gray-300 rounded-xl w-32"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);
