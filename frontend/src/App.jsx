import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Analyzer from './pages/Analyzer.jsx';
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx';
import History from './pages/History.jsx';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />  
      <Route
        path="/analyzer"
        element={
          <ProtectedRoute>
            <Analyzer/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History/>
          </ProtectedRoute>
      }
/>
    </Routes>
    
    
  );
}

export default App;