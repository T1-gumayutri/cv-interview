import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import GapAnalysisCard from '../components/GapAnalysisCard';
import { Loader2, ArrowRight } from 'lucide-react';

const Analysis = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/interview/${sessionId}`);
        setData(res.data);
      } catch (err) {
        setError('Failed to load analysis data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400">Loading your gap analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-center text-rose-500 mt-10">{error}</div>;
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-400/30';
    if (score >= 50) return 'text-amber-400 border-amber-400/30';
    return 'text-rose-400 border-rose-400/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Gap Analysis Report</h2>
        <p className="text-slate-400">For Candidate: <span className="text-slate-200 font-medium">{data.candidateName || 'Unknown'}</span></p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">CV-JD Match</div>
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold ${getScoreColor(data.fitScore)} shadow-inner`}>
            {data.fitScore}%
          </div>
          <div className="px-4 py-1.5 rounded-full bg-slate-800 text-sm font-medium border border-slate-700">
            {data.fitVerdict}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-3 text-slate-200">Honest Summary</h3>
          <p className="text-slate-400 leading-relaxed text-lg">
            {data.summary}
          </p>
        </div>
      </div>

      <GapAnalysisCard data={data} />

      <div className="flex flex-col items-center mt-12 space-y-4">
        <p className="text-sm text-slate-500">Your upcoming interview will focus heavily on your identified skill gaps.</p>
        <button
          onClick={() => navigate(`/interview/${sessionId}`)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-3 shadow-xl shadow-indigo-500/20"
        >
          Start Interview <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Analysis;
