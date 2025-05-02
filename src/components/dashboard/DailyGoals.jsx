import { Target } from "lucide-react";

export default function DailyGoals({
  dailyGoal,
  setDailyGoal,
  saveGoal,
  savedGoals,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-50 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Daily Goals</h2>
        <p className="text-slate-500">Apne daily study goals set karein</p>
      </div>

      <div className="p-6">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Aaj ka goal likhein..."
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveGoal()}
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
          <button
            onClick={saveGoal}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            Save
          </button>
        </div>

        <div className="space-y-3 max-h-[200px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-slate-50">
          {savedGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
              <div className="p-3 rounded-full bg-indigo-50 mb-3">
                <Target className="h-10 w-10 text-indigo-300" />
              </div>
              <p className="text-sm">
                Abhi tak koi goal set nahi kiya. Pehla goal add karein!
              </p>
            </div>
          ) : (
            savedGoals.map((goal, index) => (
              <div
                key={goal.id || index}
                className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 shadow-sm"
              >
                <p className="font-medium text-slate-800">{goal.text}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {goal.createdAt
                    ? new Date(
                        goal.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "Aaj"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
