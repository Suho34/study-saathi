import { lazy, useEffect, useState, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import LandingPage from "./components/layout/LandingPage";
import SignUp from "./components/pages/SignUp";
import Login from "./components/pages/Login";
import Dashboard from "./components/layout/Dashboard";
import DoubtSolver from "./components/ai-doubts/DoubtSolver";
import QuickNotes from "./components/layout/QuickNotes";
import Loading from "./components/ui/Loading";
import { StudyPlanFormLoading } from "./components/ui/StudyPlanFormLoading";
import { StudyTimerLoading } from "./components/ui/StudyTimerLoading";

const AIStudyPlanner = lazy(() =>
  import("./components/study-plan/AIStudyPlanner")
);
const StudyTimer = lazy(() => import("./components/layout/StudyTimer"));

const auth = getAuth();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      {!currentUser ? (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Dashboard user={currentUser} />} />
          <Route path="/askAi" element={<DoubtSolver />} />
          <Route
            path="/study-plan"
            element={
              <Suspense fallback={<StudyPlanFormLoading />}>
                <AIStudyPlanner userId={currentUser.uid} />
              </Suspense>
            }
          />
          <Route path="/notes" element={<QuickNotes />} />
          <Route
            path="/study-timer"
            element={
              <Suspense fallback={<StudyTimerLoading />}>
                <StudyTimer />
              </Suspense>
            }
          />
          <Route path="/signup" element={<Navigate to="/" />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default App;
