import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const ScoreCard = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 7) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 5) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-4 shadow-lg transition-all duration-300">
      
      {/* Header (Always visible) */}
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 pr-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${getScoreColor(answer.score)}`}>
            {answer.score}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {question.type.replace('_', ' ')}
            </div>
            <h4 className="text-slate-200 font-medium line-clamp-2">{question.text}</h4>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-6 animate-in slide-in-from-top-2 duration-300">
          
          <div>
            <h5 className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              ✨ Your Answer
            </h5>
            {answer.audioUrl && (
              <div className="mb-3">
                <audio 
                  controls 
                  className="w-full h-10"
                  src={`http://localhost:5000/api/admin/files/audio/${answer.audioUrl}`} 
                />
              </div>
            )}
            <p className="text-slate-200 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-sm leading-relaxed">
              "{answer.correctedTranscript || answer.transcript}"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <h5 className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                <CheckCircle className="w-4 h-4" /> Strengths
              </h5>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{answer.strengths}</p>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
              <h5 className="flex items-center gap-2 text-rose-400 font-semibold mb-3">
                <XCircle className="w-4 h-4" /> Weaknesses
              </h5>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{answer.weaknesses}</p>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
            <h5 className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
              <Lightbulb className="w-4 h-4" /> Ideal Answer Structure / Tip
            </h5>
            <p className="text-sm text-slate-300 mb-4">{answer.modelAnswer}</p>
            <div className="text-xs font-medium px-3 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg inline-block">
              Tip: {answer.tip}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ScoreCard;
