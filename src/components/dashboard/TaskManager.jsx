import { Plus, FileText, Trash2 } from "lucide-react";

export default function TaskManager({
  tasks,
  newTask,
  setNewTask,
  addTask,
  toggleTaskCompletion,
  deleteTask,
}) {
  return (
    <div className="col-span-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-50 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Task Management
        </h2>
        <p className="text-slate-500">
          Apne study tasks ko add, complete aur track karein
        </p>
      </div>

      <div className="p-6">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Naya task add karein..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-slate-50">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <div className="p-4 rounded-full bg-indigo-50 mb-4">
                <FileText className="h-12 w-12 text-indigo-300" />
              </div>
              <p className="text-lg">
                Abhi tak koi task nahi hai. Pehla task add karein!
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  task.completed
                    ? "bg-indigo-50 border-indigo-100"
                    : "bg-white border-slate-100 hover:border-indigo-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className={`h-5 w-5 rounded-md border-slate-300 focus:ring-indigo-500 ${
                      task.completed ? "text-indigo-600 border-indigo-300" : ""
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      task.completed
                        ? "line-through text-slate-500"
                        : "text-slate-800"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
