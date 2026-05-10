import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Download, User, Briefcase, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('practice');
  const [settingsData, setSettingsData] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await api.get('/admin/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data) setSettingsData(res.data.companyJobDescription || '');
      } catch (err) {
        console.error(err);
      }
    };
    
    Promise.all([fetchSessions(), fetchSettings()]).finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400">Loading data...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await api.post('/admin/settings', { companyJobDescription: settingsData });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const practiceSessions = sessions.filter(s => !s.mode || s.mode === 'practice');
  const companySessions = sessions.filter(s => s.mode === 'company');
  const displaySessions = activeTab === 'practice' ? practiceSessions : companySessions;

  const getBaseURL = () => {
    return api.defaults.baseURL || 'http://localhost:5000/api';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-slate-400 mt-1">Manage interview sessions and candidate reports</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'practice' 
            ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> Practice Sessions ({practiceSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'company' 
            ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Company Applications ({companySessions.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'settings' 
            ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" /> System Settings
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" /> Company Recruitment Configuration
          </h3>
          <p className="text-slate-400 mb-6 text-sm">
            Set the single active Job Description for the "Company Recruitment Mode". All applicants using this mode will be evaluated against this JD.
          </p>
          <div className="space-y-4">
            <textarea
              value={settingsData}
              onChange={(e) => setSettingsData(e.target.value)}
              placeholder="Paste the official Job Description here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[300px]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                {savingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Date</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Candidate</th>
                  {activeTab === 'company' && (
                    <th className="py-4 px-6 text-slate-400 font-medium text-sm">CV</th>
                  )}
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Fit Score</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Total Score</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Status</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {displaySessions.map((session) => (
                  <tr key={session.sessionId} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-300 whitespace-nowrap">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{session.candidateName || 'Unknown Candidate'}</div>
                      {activeTab === 'company' && session.candidateEmail && (
                        <div className="text-xs text-slate-400">{session.candidateEmail}</div>
                      )}
                    </td>
                    
                    {activeTab === 'company' && (
                      <td className="py-4 px-6">
                        {session.cvUrl ? (
                          <a 
                            href={`${getBaseURL()}/admin/files/cv/${session.cvUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 font-medium"
                          >
                            <Download className="w-3 h-3" /> View CV
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs">No CV</span>
                        )}
                      </td>
                    )}

                    <td className="py-4 px-6">
                      {session.fitScore !== undefined ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          session.fitScore >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
                          session.fitScore >= 40 ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>
                          {session.fitScore}%
                        </span>
                      ) : <span className="text-slate-500">-</span>}
                    </td>
                    <td className="py-4 px-6">
                      {session.totalScore !== undefined ? (
                        <span className="text-indigo-400 font-bold">{session.totalScore}/10</span>
                      ) : <span className="text-slate-500">-</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs uppercase tracking-wider text-slate-400">
                        {session.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        to={`/result/${session.sessionId}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors"
                      >
                        View Report →
                      </Link>
                    </td>
                  </tr>
                ))}
                {displaySessions.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'company' ? 7 : 6} className="py-8 text-center text-slate-400">
                      No sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
