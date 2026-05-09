import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Interview from './pages/Interview';
import Result from './pages/Result';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis/:sessionId" element={<Analysis />} />
            <Route path="/interview/:sessionId" element={<Interview />} />
            <Route path="/result/:sessionId" element={<Result />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
