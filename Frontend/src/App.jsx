import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary"; 
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Patients from "./pages/Patients"; 
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";

// 2. Simple fallback UI
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Something went wrong.</h1>
      <p style={{ color: "red" }}>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

const App = () => {
  return (
    /* 3. Wrap everything in the ErrorBoundary */
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.href = "/"} // Optional: refresh app state
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        } />
        <Route path="/prediction" element={
          <ProtectedRoute>
            <Prediction />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
