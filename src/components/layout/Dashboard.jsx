import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  BookOpen,
  Clock,
  BookMarked,
  LineChart,
  PenSquare,
  LayoutDashboard,
  LogOut,
  Settings,
  MessageCircle,
  CheckSquare,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TaskManager from "../dashboard/TaskManager";
import TaskStatistics from "../dashboard/TaskStatistics";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Chart data
  const chartData = {
    labels: ["Pura hua", "Baki hai"],
    datasets: [
      {
        data: [
          tasks.filter((task) => task.completed).length,
          tasks.filter((task) => !task.completed).length,
        ],
        backgroundColor: ["#10b981", "#e11d48"],
        borderColor: ["#059669", "#be123c"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          await Promise.all([fetchTasks(currentUser.uid)]);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchTasks = async (userId) => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const taskList = [];
      querySnapshot.forEach((docSnap) => {
        taskList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Tasks load nahi ho paye. Phir try karein!");
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const taskData = {
        title: newTask,
        completed: false,
        createdAt: new Date(),
        userId: user.uid,
      };

      const docRef = await addDoc(collection(db, "tasks"), taskData);
      setTasks([...tasks, { id: docRef.id, ...taskData }]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Task add nahi hua. Phir try karein!");
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;

      await updateDoc(doc(db, "tasks", taskId), {
        completed: updatedTasks[taskIndex].completed,
      });

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "px-4" : "px-4 pb-8"}`}>
      {!mobile && (
        <div className="flex items-center gap-3 px-2 py-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            StudySaathi
          </h1>
        </div>
      )}

      {user && (
        <div className="mx-2 my-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 border border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center shadow-sm">
              <span className="text-xl font-semibold text-indigo-700">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Waapas aayein!</h3>
              <p className="text-xs text-slate-500 truncate max-w-[160px]">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-700 bg-indigo-50 font-medium shadow-sm hover:shadow-md transition-all duration-200">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>
        <Link
          to="/askAi"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <MessageCircle className="h-5 w-5" />
          Ask AI
        </Link>
        <Link
          to="/study-plan"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <CheckSquare className="h-5 w-5" />
          Study Planner
        </Link>
        <Link
          to="/study-timer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <Clock className="h-5 w-5" />
          Study Timer
        </Link>
        <Link
          to="/notes"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <PenSquare className="h-5 w-5" />
          Quick Notes
        </Link>
        <Link
          to="/resources"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <BookMarked className="h-5 w-5" />
          Resources
        </Link>
        <Link
          to="/progress"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <LineChart className="h-5 w-5" />
          Progress
        </Link>
      </div>

      <div className="mt-auto pt-4">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200">
          <Settings className="h-5 w-5" />
          Settings
        </button>
        <button
          className="flex w-full items-center gap-3 mt-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl rounded-r-3xl overflow-hidden md:hidden"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent mobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden w-72 flex-col bg-white shadow-xl rounded-r-3xl overflow-hidden md:flex">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white/80 backdrop-blur-lg px-6 shadow-sm">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="mr-4 p-2 rounded-xl hover:bg-indigo-50"
            >
              <Menu className="h-5 w-5 text-indigo-600" />
            </button>
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="ml-2 text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              StudySaathi
            </h1>
          </div>

          <div className="md:flex-1 md:ml-6">
            <h2 className="hidden text-xl font-semibold text-slate-800 md:block">
              Welcome back to your studies!
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center md:hidden">
              <span className="text-indigo-700 text-sm font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            <button
              className="p-2 rounded-xl hover:bg-red-50 text-red-600 md:hidden transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Aapka Study Dashboard
            </h1>
            <p className="text-slate-500 text-lg">
              Apni padhai ko track karein aur goals complete karein
            </p>
          </div>

          <div className="space-y-8">
            {/* Task Management and Statistics */}
            <div className="grid gap-8 lg:grid-cols-3">
              <TaskManager
                tasks={tasks}
                newTask={newTask}
                setNewTask={setNewTask}
                addTask={addTask}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
              <TaskStatistics tasks={tasks} chartData={chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
