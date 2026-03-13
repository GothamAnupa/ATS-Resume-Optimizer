import { Navigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { Target, CheckCircle2, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Dashboard() {
  const { analysisResult } = useResumeStore();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  if (!analysisResult) {
    return <Navigate to="/input" replace />;
  }

  const { 
    overallFitScore, 
    overallReasonsForFit, 
    overallReasonsForNotFit, 
    overallMissingRequirements,
    sectionsAnalysis
  } = analysisResult;

  const scoreColor = 
    overallFitScore >= 80 ? 'text-emerald-600' : 
    overallFitScore >= 60 ? 'text-amber-600' : 
    'text-red-600';

  const scoreBg = 
    overallFitScore >= 80 ? 'bg-emerald-50 border-emerald-200' : 
    overallFitScore >= 60 ? 'bg-amber-50 border-amber-200' : 
    'bg-red-50 border-red-200';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Analysis Dashboard</h1>
          <p className="text-zinc-500 mt-1">Comprehensive breakdown of your resume's fit for the role.</p>
        </div>
      </div>

      {/* Bento Grid Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`col-span-1 p-8 rounded-3xl border flex flex-col items-center justify-center text-center shadow-sm ${scoreBg}`}
        >
          <div className="text-sm font-bold text-zinc-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Fit Score
          </div>
          <div className={`text-7xl font-black tracking-tighter ${scoreColor}`}>
            {overallFitScore}%
          </div>
          
          <div className="w-full bg-white/60 rounded-full h-3 mt-6 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallFitScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                overallFitScore >= 80 ? 'bg-emerald-500' : 
                overallFitScore >= 60 ? 'bg-amber-500' : 
                'bg-red-500'
              }`}
            />
          </div>

          <p className="mt-6 text-sm text-zinc-700 font-medium max-w-[200px]">
            {overallFitScore >= 80 ? 'Excellent match! You are a strong candidate.' : 
             overallFitScore >= 60 ? 'Good match, but there is room for optimization.' : 
             'Low match. Significant optimization is recommended.'}
          </p>
        </motion.div>

        {/* Reasons for Fit / Not Fit */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Why You're a Fit
            </h3>
            <ul className="space-y-3 flex-1 overflow-y-auto pr-2">
              {overallReasonsForFit.map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Missing Requirements
            </h3>
            <ul className="space-y-3 flex-1 overflow-y-auto pr-2">
              {overallMissingRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  {req}
                </li>
              ))}
              {overallReasonsForNotFit.map((reason, i) => (
                <li key={`reason-${i}`} className="flex items-start gap-3 text-zinc-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section Analysis Grid */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-4">Section-by-Section Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsAnalysis.map((section, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
              onClick={() => setSelectedSection(selectedSection === section.sectionName ? null : section.sectionName)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900">{section.sectionName}</h3>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  section.matchScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  section.matchScore >= 60 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {section.matchScore}% Match
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-3">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Missing Keywords</div>
                  <div className="flex flex-wrap gap-1.5">
                    {section.missingKeywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-xs">{kw}</span>
                    ))}
                    {section.missingKeywords.length > 3 && (
                      <span className="px-2 py-0.5 bg-zinc-50 text-zinc-400 rounded text-xs">+{section.missingKeywords.length - 3} more</span>
                    )}
                    {section.missingKeywords.length === 0 && (
                      <span className="text-xs text-emerald-600 font-medium">None!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-blue-600 text-sm font-medium">
                View Details
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedSection === section.sectionName ? 'rotate-90' : ''}`} />
              </div>

              {/* Expanded Details */}
              {selectedSection === section.sectionName && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-zinc-100 space-y-4"
                >
                  {section.whyItFits.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Why it fits</div>
                      <ul className="space-y-1">
                        {section.whyItFits.map((item, i) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {section.suggestions.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Suggestions</div>
                      <ul className="space-y-1">
                        {section.suggestions.map((item, i) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.improvedExample && (
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Improved Example</div>
                      <p className="text-sm text-zinc-700 italic">"{section.improvedExample}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
