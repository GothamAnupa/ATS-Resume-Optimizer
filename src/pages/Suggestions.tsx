import { Navigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { Sparkles, Download, FileText, LayoutTemplate, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { useRef, useState } from 'react';
import { ClassicResume } from '../components/templates/ClassicResume';
import { ModernResume } from '../components/templates/ModernResume';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

type TemplateType = 'classic' | 'modern' | 'markdown';

export function Suggestions() {
  const { analysisResult, baseResume } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!analysisResult) {
    return <Navigate to="/input" replace />;
  }

  const { optimizedResume, optimizedResumeData } = analysisResult;

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      setIsGenerating(true);
      const element = resumeRef.current;
      
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.clientHeight * pdfWidth) / element.clientWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Optimized_Resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print if html-to-image fails
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col print:space-y-0 print:block print:h-auto">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Optimized Resume</h1>
          <p className="text-zinc-500 mt-1">Review your rewritten resume side-by-side.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                template === 'classic' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                template === 'modern' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => setTemplate('markdown')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                template === 'markdown' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Markdown
            </button>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 print:block print:h-auto">
        {/* Original Resume */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden print:hidden">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2 font-semibold text-zinc-800">
            <FileText className="w-4 h-4 text-zinc-400" />
            Original Resume
          </div>
          <div className="flex-1 overflow-auto p-6 bg-zinc-50 font-mono text-sm text-zinc-600 whitespace-pre-wrap">
            {baseResume}
          </div>
        </div>

        {/* Optimized Resume */}
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm flex flex-col overflow-hidden print:border-none print:shadow-none print:block">
          <div className="p-4 border-b border-blue-100 bg-blue-50/50 flex items-center gap-2 font-semibold text-blue-800 print:hidden">
            <LayoutTemplate className="w-4 h-4 text-blue-600" />
            Optimized Resume ({template})
          </div>
          <div className="flex-1 overflow-auto bg-zinc-100 p-4 print:p-0 print:bg-white print:overflow-visible">
            <div className="shadow-sm border border-zinc-200 max-w-[800px] mx-auto print:shadow-none print:border-none print:max-w-none print:m-0">
              <div ref={resumeRef} className="bg-white print:w-full">
                {template === 'classic' && optimizedResumeData && (
                  <ClassicResume data={optimizedResumeData} />
                )}
                {template === 'modern' && optimizedResumeData && (
                  <ModernResume data={optimizedResumeData} />
                )}
                {template === 'markdown' && (
                  <div className="p-8 prose prose-zinc prose-sm max-w-none">
                    <Markdown>{optimizedResume}</Markdown>
                  </div>
                )}
                {!optimizedResumeData && template !== 'markdown' && (
                  <div className="p-8 text-center text-zinc-500">
                    Structured data not available. Please run analysis again or use Markdown view.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

