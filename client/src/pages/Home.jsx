import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import CVUploader from '../components/CVUploader';
import JDInput from '../components/JDInput';
import { Loader2, Briefcase, UserCheck } from 'lucide-react';

const Home = () => {
  const [mode, setMode] = useState('practice');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');

  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [interviewLanguage, setInterviewLanguage] = useState('vi-VN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [activeJd, setActiveJd] = useState('');

  useEffect(() => {
    if (mode === 'company') {
      const fetchActiveJd = async () => {
        try {
          const res = await api.get('/jobs/active');
          setActiveJd(res.data.companyJobDescription);
        } catch (err) {
          console.error('Failed to fetch active JD', err);
        }
      };
      fetchActiveJd();
    }
  }, [mode]);

  const handleAnalyze = async () => {
    if (!cvFile || !candidateName || !candidateEmail) return;
    if (mode === 'practice' && !jobDescription) return;

    setLoading(true);
    setError('');

    try {
      // 1. Upload CV
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('mode', mode);
      formData.append('candidateName', candidateName);
      formData.append('candidateEmail', candidateEmail);
      formData.append('interviewLanguage', interviewLanguage);
      
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { sessionId } = uploadRes.data;

      // 2. Analyze Gap
      const payload = { sessionId };
      if (mode === 'practice') {
        payload.jobDescription = jobDescription;
      }
      
      await api.post('/analyze', payload);

      // 3. Navigate to Analysis Page
      navigate(`/analysis/${sessionId}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during analysis. Please try again.');
      setLoading(false);
    }
  };

  const isFormValid = cvFile && candidateName && candidateEmail && (mode === 'company' || jobDescription);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          AI Interview Simulator
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Upload your CV, provide details, and conduct a targeted AI interview.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1 rounded-xl flex shadow-lg">
          <button
            onClick={() => setMode('practice')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'practice' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-5 h-5" /> Practice Mode
          </button>
          <button
            onClick={() => setMode('company')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              mode === 'company' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-5 h-5" /> Apply for a Job
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Basic Info Form */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid md:grid-cols-2 gap-6 shadow-lg">
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
           <input 
             type="text" 
             value={candidateName}
             onChange={(e) => setCandidateName(e.target.value)}
             className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500"
             placeholder="John Doe"
             required
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
           <input 
             type="email" 
             value={candidateEmail}
             onChange={(e) => setCandidateEmail(e.target.value)}
             className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500"
             placeholder="john@example.com"
             required
           />
        </div>

      </div>

      {/* Language Selector */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col items-center">
        <label className="block text-sm font-medium text-slate-400 mb-4">Interview Language</label>
        <div className="flex gap-4">
          <label className={`cursor-pointer px-6 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${interviewLanguage === 'vi-VN' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold' : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'}`}>
            <input 
              type="radio" 
              name="language" 
              value="vi-VN" 
              checked={interviewLanguage === 'vi-VN'} 
              onChange={(e) => setInterviewLanguage(e.target.value)} 
              className="hidden" 
            />
            🇻🇳 Tiếng Việt
          </label>
          <label className={`cursor-pointer px-6 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${interviewLanguage === 'en-US' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold' : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'}`}>
            <input 
              type="radio" 
              name="language" 
              value="en-US" 
              checked={interviewLanguage === 'en-US'} 
              onChange={(e) => setInterviewLanguage(e.target.value)} 
              className="hidden" 
            />
            🇺🇸 English
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <CVUploader onFileSelect={setCvFile} selectedFile={cvFile} />
        {mode === 'practice' ? (
          <JDInput value={jobDescription} onChange={setJobDescription} />
        ) : (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col shadow-lg h-full max-h-[400px]">
             <div className="flex items-center gap-2 mb-4">
               <Briefcase className="w-5 h-5 text-emerald-500" />
               <h3 className="text-lg font-semibold text-slate-200">Company Job Description</h3>
             </div>
             <p className="text-slate-400 text-sm mb-4">
               This is the official position you are applying for. Your CV will be evaluated against these requirements.
             </p>
             <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto flex-grow text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
               {activeJd || 'Loading job description...'}
             </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={handleAnalyze}
          disabled={!isFormValid || loading}
          className={`py-4 px-8 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 shadow-xl disabled:shadow-none disabled:bg-slate-800 disabled:text-slate-500 text-white ${
            mode === 'company' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              AI is analyzing your fit...
            </>
          ) : (
             mode === 'company' ? 'Submit Application & Start' : 'Analyze My Fit'
          )}
        </button>
      </div>

      <div className="mt-16 text-center pb-8">
        <Link to="/admin" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
          Interviewer Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
