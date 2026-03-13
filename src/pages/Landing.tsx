import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, ArrowRight, CheckCircle2, Sparkles, Target } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Resume Optimization
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-tight">
          Land your dream job with a <span className="text-blue-600">tailored resume</span>
        </h1>
        
        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
          Upload your resume and a job description. Our AI analyzes the fit, suggests critical keywords, and rewrites your experience to match what recruiters are looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/input"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 w-full sm:w-auto"
          >
            Start Optimizing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
            <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Job Fit Analysis</h3>
            <p className="text-zinc-600 text-sm font-medium">Get a detailed score and discover exactly which skills you're missing from the job description.</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Smart Rewriting</h3>
            <p className="text-zinc-600 text-sm font-medium">We rewrite your experience to highlight relevant achievements while keeping your core details untouched.</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Cover Letters</h3>
            <p className="text-zinc-600 text-sm font-medium">Instantly generate a personalized, human-sounding cover letter tailored to the specific role.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

