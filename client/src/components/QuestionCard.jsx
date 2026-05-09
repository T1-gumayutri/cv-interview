import { HelpCircle } from 'lucide-react';

const QuestionCard = ({ question }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
        <HelpCircle className="w-6 h-6" />
      </div>
      <p className="text-2xl font-medium leading-relaxed text-slate-200">
        {question}
      </p>
    </div>
  );
};

export default QuestionCard;
