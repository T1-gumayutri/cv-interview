import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const GapAnalysisCard = ({ data }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Matched Skills */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" /> Matched Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.matchedSkills.length > 0 ? data.matchedSkills.map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium">
              {skill}
            </span>
          )) : (
            <span className="text-slate-500 text-sm">No significant matches found.</span>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-rose-400">
          <XCircle className="w-5 h-5" /> Missing Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.missingSkills.length > 0 ? data.missingSkills.map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium">
              {skill}
            </span>
          )) : (
            <span className="text-slate-500 text-sm">No significant gaps found!</span>
          )}
        </div>
      </div>

      {/* Overqualified */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-300">
          <AlertCircle className="w-5 h-5 text-amber-400" /> Overqualified For
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.overqualified.length > 0 ? data.overqualified.map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium">
              {skill}
            </span>
          )) : (
            <span className="text-slate-500 text-sm">None identified.</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default GapAnalysisCard;
