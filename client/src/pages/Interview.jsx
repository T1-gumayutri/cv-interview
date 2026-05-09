import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import VoiceRecorder from '../components/VoiceRecorder';
import { Loader2 } from 'lucide-react';

const Interview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log("Available TTS voices:", availableVoices.map(v => v.name + " (" + v.lang + ")"));
    };
    handleVoicesChanged(); // Initial load
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/interview/${sessionId}`);
        setSessionData(res.data);
        // Fast forward if already answered questions
        if (res.data.answers?.length > 0) {
           setCurrentQIndex(Math.min(res.data.answers.length, res.data.questions.length - 1));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // TTS for the current question
  useEffect(() => {
    if (sessionData && sessionData.questions && voices.length > 0) {
      const currentQ = sessionData.questions[currentQIndex];
      if (currentQ && currentQ.text) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(currentQ.text);
        
        const lang = sessionData.interviewLanguage || 'vi-VN';
        utterance.lang = lang;
        
        if (lang === 'vi-VN') {
           const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang === 'vi' || v.name.includes('An') || v.name.includes('Linh') || v.name.includes('Vietnamese'));
           if (viVoice) utterance.voice = viVoice;
        } else if (lang === 'en-US') {
           const enVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en_US'));
           if (enVoice) utterance.voice = enVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      }
    }
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [sessionData, currentQIndex, voices]);

  const handleAnswerSubmit = async (transcript, audioBlob) => {
    setEvaluating(true);
    const currentQ = sessionData.questions[currentQIndex];
    
    try {
      const dataToSend = new FormData();
      dataToSend.append('sessionId', sessionId);
      dataToSend.append('questionId', currentQ.id);
      dataToSend.append('transcript', transcript);
      
      if (audioBlob) {
        dataToSend.append('audio', audioBlob, 'answer_audio.webm');
      }

      const res = await api.post('/evaluate', dataToSend);
      setEvaluationResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluationResult(null);
    if (currentQIndex < sessionData.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handleFinishInterview = async () => {
    setFinishing(true);
    try {
      await api.post('/interview/complete', { sessionId });
      navigate(`/result/${sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to complete interview.');
      setFinishing(false);
    }
  };

  if (loading || !sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400">Preparing your interview room...</p>
      </div>
    );
  }

  const currentQ = sessionData.questions[currentQIndex];
  const isLastQuestion = currentQIndex === sessionData.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold">Live Interview</h2>
          <p className="text-slate-400 text-sm">Question {currentQIndex + 1} of {sessionData.questions.length}</p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold border border-indigo-500/20 uppercase tracking-wider">
          {currentQ.type.replace('_', ' ')}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2">
        <div 
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${((currentQIndex) / sessionData.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <QuestionCard question={currentQ.text} />

      {/* Evaluation Result or Voice Recorder */}
      {evaluating ? (
        <div className="bg-slate-900 rounded-2xl p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
           <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
           <p className="text-slate-300 text-lg">AI is evaluating your answer...</p>
        </div>
      ) : evaluationResult ? (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold">Instant Feedback</h3>
            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
              evaluationResult.score >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
              evaluationResult.score >= 5 ? 'bg-amber-500/20 text-amber-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              Score: {evaluationResult.score}/10
            </div>
          </div>
          {evaluationResult.correctedTranscript && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-left mb-6">
              <h4 className="text-sm text-indigo-400 font-semibold mb-2">✨ Your Answer</h4>
              <p className="text-slate-300 text-sm italic">"{evaluationResult.correctedTranscript}"</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm text-emerald-400 font-semibold uppercase tracking-wider">Strengths</h4>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{evaluationResult.strengths}</p>
            </div>
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm text-rose-400 font-semibold uppercase tracking-wider">Weaknesses</h4>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{evaluationResult.weaknesses}</p>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            {!isLastQuestion ? (
              <button 
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-xl font-semibold transition-all"
              >
                Next Question →
              </button>
            ) : (
              <button 
                onClick={handleFinishInterview}
                disabled={finishing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                {finishing && <Loader2 className="w-4 h-4 animate-spin" />}
                Finish Interview
              </button>
            )}
          </div>
        </div>
      ) : (
        <VoiceRecorder 
          onSubmit={handleAnswerSubmit} 
          mode={sessionData.mode} 
          language={sessionData.interviewLanguage} 
        />
      )}
      
    </div>
  );
};

export default Interview;
