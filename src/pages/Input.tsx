import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { analyzeAndOptimizeResume } from '../services/ai';
import { Loader2, UploadCloud, FileText, FileUp } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Markdown from 'react-markdown';

// Initialize PDF.js worker using Vite's URL import
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export function Input() {
  const navigate = useNavigate();
  const { 
    baseResume, 
    jobDescription, 
    setBaseResume, 
    setJobDescription, 
    setAnalysisResult, 
    setIsAnalyzing, 
    isAnalyzing,
    analysisResult
  } = useResumeStore();

  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(' ') + '\n';
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
      }
      setBaseResume(text);
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(err.message || 'Failed to parse file.');
      setFileName(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!baseResume.trim() || !jobDescription.trim()) {
      setError('Please provide both your resume and the job description.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeAndOptimizeResume(baseResume, jobDescription);
      setAnalysisResult(result);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Analysis error:", err);
      if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
        setError('Network error: Failed to connect to the AI service. Please check your internet connection or disable any ad blockers that might be blocking the request.');
      } else {
        setError(err.message || 'An error occurred during analysis. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Workspace</h1>
          <p className="text-zinc-500 mt-1">Upload your resume and job description to get started.</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !baseResume.trim() || !jobDescription.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Run Analysis'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Resume Upload */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-zinc-800">
                <FileText className="w-5 h-5 text-blue-600" />
                Your Resume
              </div>
              <div className="text-xs text-zinc-400 font-medium">PDF, DOCX</div>
            </div>
            
            <div className="mb-4">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100 hover:border-blue-400 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-8 h-8 text-zinc-400 mb-2" />
                  <p className="text-sm text-zinc-600 font-medium">
                    {fileName ? fileName : 'Click to upload or drag and drop'}
                  </p>
                </div>
              </label>
            </div>

            <textarea
              value={baseResume}
              onChange={(e) => setBaseResume(e.target.value)}
              placeholder="Or paste your resume text here..."
              className="flex-1 min-h-[200px] w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-zinc-700"
            />
          </div>

          {/* Job Description */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col flex-1">
            <div className="flex items-center gap-2 text-lg font-semibold text-zinc-800 mb-4">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
              Job Description
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="flex-1 min-h-[200px] w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm text-zinc-700"
            />
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <div className="font-semibold text-zinc-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              Live Preview
            </div>
            {analysisResult && (
              <div className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
                Optimized
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
            {analysisResult ? (
              <div className="prose prose-zinc prose-sm max-w-none bg-white p-8 rounded-xl shadow-sm border border-zinc-200 min-h-full">
                <Markdown>{analysisResult.optimizedResume}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <FileText className="w-16 h-16 opacity-20" />
                <p className="text-sm font-medium">Run analysis to see your optimized resume here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
