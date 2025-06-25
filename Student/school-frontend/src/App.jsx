import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import AuthRoute from "./components/Sidebar/AuthRoute.jsx";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const StudentDashboard = lazy(() =>
  import("./pages/student/StudentDashboard.jsx")
);
const TeacherDashboard = lazy(() =>
  import("./pages/teacher/TeacherDashboard.jsx")
);
const PrincipalDashboard = lazy(() =>
  import("./pages/principal/PrincipalDashboard.jsx")
);

// Optional: custom loading spinner (if you already created one)
const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "80px", fontSize: "1.2rem" }}>
    ⏳ Please wait, loading dashboard...
  </div>
);

// const AuthRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     // ⚠️ Token ન હોવા પર redirect to login
//     return <Navigate to="/" replace />;
//   }

//   // ✅ Token હોય તો children render કરો (dashboard pages)
//   return children;
// };

function App() {
  React.useEffect(() => {
    AuthRoute();
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes inside App Layout */}
        <Route element={<AppLayout />}>
          <Route
            path="*"
            element={<AuthRoute children={<StudentDashboard />} />}
          />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
