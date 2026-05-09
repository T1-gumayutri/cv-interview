import { Briefcase } from 'lucide-react';

const JDInput = ({ value, onChange }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase className="text-emerald-400" /> Job Description
        </h2>
        <span className={`text-xs ${value.length > 50 ? 'text-slate-400' : 'text-rose-400'}`}>
          {value.length} chars
        </span>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full Job Description here..."
        className="flex-grow w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none min-h-[250px]"
      />
    </div>
  );
};

export default JDInput;
