export const StudyPlanFormLoading = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-100 rounded-md"></div>
        </div>
      ))}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-24 bg-gray-100 rounded-md"></div>
      </div>
    </div>
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="h-12 bg-gray-300 rounded-md w-full"></div>
    </div>
  </div>
);
