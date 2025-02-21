import "./App.css";
import emailjs from "@emailjs/browser";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./users/pages/Landing.jsx";
import Login from "./users/pages/Login.jsx";
import Register from "./users/pages/Register.jsx";
import Dashboard from "./shared/pages/Dashboard.jsx";
import Home from "./shared/pages/Home.jsx";
import Reports from "./shared/pages/Reports.jsx";
import Charts from "./shared/pages/Charts.jsx";
import TransactionHistory from "./shared/pages/TransactionHistory.jsx";
import AddExpense from "./shared/pages/AddExpense.jsx";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}
emailjs.init("SeeWNdhjAbsjfMLHZ"); // Your public key
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/:userId"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="history" element={<TransactionHistory />} />
          <Route path="addExpense" element={<AddExpense />} />
          <Route path="reports" element={<Reports />} />
          <Route path="charts" element={<Charts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
