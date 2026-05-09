import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ScoreCard from '../components/ScoreCard';
import { Loader2, RefreshCcw, Target } from 'lucide-react';

const Result = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/interview/${sessionId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400">Generating your final report...</p>
      </div>
    );
  }

  const getScoreColor = (score, isPercent = false) => {
    const val = isPercent ? score : score * 10;
    if (val >= 75) return 'text-emerald-400 border-emerald-400';
    if (val >= 50) return 'text-amber-400 border-amber-400';
    return 'text-rose-400 border-rose-400';
  };

  const getRecBadge = (rec) => {
    switch(rec) {
      case 'Hire': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Maybe': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Not Yet': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const isIncomplete = data.status === 'analyzed' || data.status === 'in_progress';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold">
          {isIncomplete ? "Interview In Progress" : "Final Assessment Report"}
        </h1>
        <p className="text-slate-400">
          {isIncomplete 
            ? "Candidate has not completed the interview yet. Generated questions are listed below." 
            : "Honest feedback based on your CV and interview performance."}
        </p>
      </div>

      {!isIncomplete && (
        <>
          {/* Top Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-4">CV Fit Score</div>
              <div className={`text-4xl font-bold ${getScoreColor(data.fitScore, true)}`}>
                {data.fitScore}%
              </div>
              <div className="text-sm mt-2 text-slate-500">{data.fitVerdict}</div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-4">Interview Score</div>
              <div className={`text-4xl font-bold ${getScoreColor(data.totalScore)}`}>
                {data.totalScore} <span className="text-2xl text-slate-500">/ 10</span>
              </div>
              <div className="text-sm mt-2 text-slate-500">Average Answer Score</div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-4">Recommendation</div>
              <div className={`px-6 py-3 rounded-xl border-2 font-bold text-xl uppercase tracking-wider ${getRecBadge(data.hiringRecommendation)}`}>
                {data.hiringRecommendation}
              </div>
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-400" /> Honest Verdict
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
              {data.overallFeedback}
            </p>
          </div>

          {/* Skills to close */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-amber-400">Action Items Before Reapplying</h3>
            <ul className="space-y-4">
              {data.closingGaps.map((gap, i) => (
                <li key={i} className="flex gap-4 items-start bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
                    {i + 1}
                  </div>
                  <p className="text-slate-300 pt-1">{gap}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Question Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold pl-2">
          {isIncomplete ? "Generated Questions" : "Detailed Q&A Breakdown"}
        </h3>
        {data.questions.map(q => {
          const answer = data.answers.find(a => a.questionId === q.id);
          
          if (!answer && isIncomplete) {
            return (
              <div key={q.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold text-slate-200">Question {q.id}</h4>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {q.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-300 text-lg mb-4">{q.text}</p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-500 text-sm italic">
                  Candidate has not answered this question yet.
                </div>
              </div>
            );
          }
          
          return answer && (
            <ScoreCard key={q.id} question={q} answer={answer} />
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-xl shadow-indigo-500/20"
        >
          <RefreshCcw className="w-5 h-5" /> Try Another JD
        </button>
      </div>

    </div>
  );
};

export default Result;
