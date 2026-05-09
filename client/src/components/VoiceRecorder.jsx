import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Edit3, Send } from 'lucide-react';

const VoiceRecorder = ({ onSubmit, mode = 'practice', language = 'vi-VN' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isManualEdit, setIsManualEdit] = useState(false);
  const recognitionRef = useRef(null);
  
  // MediaRecorder refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Countdown Timer State
  const initialTime = isManualEdit ? 180 : 30;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (mode === 'company') {
      setTimeLeft(initialTime);
    }
  }, [isManualEdit, mode, initialTime]);

  useEffect(() => {
    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language; 

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
           stopRecording();
        }
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
      setIsManualEdit(true); // Fallback to manual typing
    }

    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer Effect
  useEffect(() => {
    let timerId;
    if (isRecording && mode === 'company' && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRecording && mode === 'company' && timeLeft <= 0) {
      // Auto submit when time runs out
      handleSubmit();
    }
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, timeLeft, mode]);

  // Silence Detection Effect
  useEffect(() => {
    let silenceTimer;
    if (isRecording && !isManualEdit && transcript.trim()) {
      silenceTimer = setTimeout(() => {
        console.log("5 seconds of silence detected. Auto-submitting...");
        handleSubmit();
      }, 5000);
    }
    return () => clearTimeout(silenceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isRecording, isManualEdit]);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/wav'
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  const startRecording = async () => {
    setTranscript('');
    setTimeLeft(initialTime);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      
      const options = mimeType ? { mimeType } : undefined;
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start(200); // collect 200ms chunks
      
      if (recognitionRef.current && !isManualEdit) {
        recognitionRef.current.start();
      }
      
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone or initializing MediaRecorder:", err);
      // Fallback to manual typing
      setIsManualEdit(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { 
        mediaRecorderRef.current.stop(); 
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch(e) {}
    }
    setIsRecording(false);
  };

  const handleSubmit = () => {
    stopRecording();
    
    if (!transcript.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }

    if (isManualEdit || audioChunksRef.current.length === 0) {
      // Submission without audio
      onSubmit(transcript, null);
    } else {
      // Need a slight delay to ensure the last chunk of MediaRecorder is processed
      setTimeout(() => {
        const mimeType = getSupportedMimeType() || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        onSubmit(transcript, audioBlob);
      }, 300);
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-rose-500 animate-pulse';
    if (timeLeft <= 30) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center">
      
      {!isManualEdit && 'webkitSpeechRecognition' in window ? (
        <>
          <div className="mb-6 relative flex justify-center items-center">
            {/* Pulsing ring when recording */}
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/50 animate-ping"></div>
            )}
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105'
              }`}
            >
              {isRecording ? <Square className="w-10 h-10 text-white fill-current" /> : <Mic className="w-10 h-10 text-white" />}
            </button>
          </div>

          <div className="text-center mb-6">
             {isRecording ? (
               <div className={`text-2xl font-bold font-mono ${mode === 'company' ? getTimerColor() : 'text-indigo-400'}`}>
                 {mode === 'company' ? formatTime(timeLeft) : 'Recording...'}
               </div>
             ) : (
               <p className="text-slate-400">Click the microphone to start answering</p>
             )}
          </div>

          <div className="w-full bg-slate-950 rounded-xl p-4 min-h-[100px] border border-slate-800 mb-6 relative">
            {transcript ? (
              <p className="text-slate-200 text-lg leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-slate-600 text-lg italic text-center mt-6">Your voice transcript will appear here...</p>
            )}
          </div>
        </>
      ) : (
        <div className="w-full mb-6">
           <div className="flex justify-between items-center mb-2">
             <label className="text-slate-400 font-medium text-sm flex items-center gap-2">
               <Edit3 className="w-4 h-4" /> Manual Entry Mode
             </label>
           </div>
           <textarea 
             value={transcript}
             onChange={(e) => setTranscript(e.target.value)}
             placeholder="Type your answer here..."
             className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[150px] resize-y"
           />
        </div>
      )}

      <div className="flex justify-between w-full items-center">
        {!isManualEdit && 'webkitSpeechRecognition' in window && (
          <button 
            onClick={() => {
              if(isRecording) stopRecording();
              setIsManualEdit(true);
            }}
            className="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" /> Switch to Typing
          </button>
        )}
        
        {isManualEdit && 'webkitSpeechRecognition' in window && (
          <button 
            onClick={() => setIsManualEdit(false)}
            className="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center gap-1"
          >
            <Mic className="w-4 h-4" /> Switch to Voice
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!transcript.trim()}
          className="ml-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 px-8 rounded-xl font-semibold transition-all hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 shadow-xl shadow-emerald-500/20 disabled:shadow-none"
        >
          {isRecording ? 'Stop & Submit' : 'Submit Answer'} <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default VoiceRecorder;
