import { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const CVUploader = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="text-indigo-400" /> Upload CV
      </h2>
      
      <div 
        className={`flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10' : 
          selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 
          'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept=".pdf"
          className="hidden" 
        />

        {selectedFile ? (
          <div className="text-center space-y-3 relative w-full">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-8 h-8" />
            </div>
            <p className="font-medium text-emerald-400 truncate px-4">{selectedFile.name}</p>
            <p className="text-sm text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              onClick={clearFile}
              className="absolute -top-2 -right-2 p-1 bg-slate-800 hover:bg-rose-500 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-slate-200">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-400 mt-1">PDF only (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVUploader;
