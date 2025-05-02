import { Target } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

export default function TaskStatistics({ tasks, chartData }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-50 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Task Statistics
        </h2>
        <p className="text-slate-500">
          Aapke progress ka visual representation
        </p>
      </div>

      <div className="p-6">
        <div className="w-48 h-48 mx-auto">
          {tasks.length > 0 ? (
            <Doughnut
              data={{
                ...chartData,
                datasets: [
                  {
                    ...chartData.datasets[0],
                    backgroundColor: ["rgb(99, 102, 241)", "rgb(239, 68, 68)"],
                    borderColor: "transparent",
                    borderWidth: 2,
                    hoverOffset: 4,
                  },
                ],
              }}
              options={{
                cutout: "70%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-center text-slate-400">
              <div className="rounded-full bg-indigo-50 p-6">
                <Target className="h-12 w-12 text-indigo-300" />
              </div>
              <p className="mt-4 text-sm">
                Statistics dikhane ke liye tasks add karein
              </p>
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="rounded-xl bg-indigo-50 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Pura hua
              </p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {tasks.filter((task) => task.completed).length}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Baki hai
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {tasks.filter((task) => !task.completed).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
