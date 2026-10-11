import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Transactions from "./pages/Transactions";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="screen-message">Loading StockWise...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function LoginPage() {
  return (
    <div className="auth-placeholder">
      <div>
        <b className="auth-brand">StockWise</b>
        <h1>Welcome back</h1>
        <p>Your login form will be connected here.</p>
        <a href="/register">Create an account →</a>
        <br />
        <a href="/">← Back to home</a>
      </div>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="auth-placeholder">
      <div>
        <b className="auth-brand">StockWise</b>
        <h1>Create your account</h1>
        <p>Your registration form will be connected here.</p>
        <a href="/login">Already have an account? Log in →</a>
        <br />
        <a href="/">← Back to home</a>
      </div>
    </div>
  );
}

function DashboardPage() {
  return <div className="screen-message">StockWise Dashboard — coming next.</div>;
}

function ProductsPage() {
  return <div className="screen-message">Products — coming next.</div>;
}

function TransactionsPage() {
  return <div className="screen-message">Transactions — coming next.</div>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

    <Route
  path="/login"
  element={
    user && !loading ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Login />
    )
  }
/>

     <Route
  path="/register"
  element={
    user && !loading ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Register />
    )
  }
/>
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

      <Route
  path="/products"
  element={
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  }
/>

    <Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}