import { Navigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { FileSignature, Download, Copy, Check, LayoutTemplate, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { useState, useRef } from 'react';
import { ProfessionalCoverLetter } from '../components/templates/ProfessionalCoverLetter';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

type TemplateType = 'professional' | 'markdown';

export function CoverLetter() {
  const { analysisResult } = useResumeStore();
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  if (!analysisResult) {
    return <Navigate to="/input" replace />;
  }

  const { coverLetter, coverLetterData, optimizedResumeData } = analysisResult;

  // Filter out phone numbers (matches common phone number formats)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const simplePhoneRegex = /^[\d\+\-\(\)\s]+$/;
  
  const filteredContactInfo = optimizedResumeData?.personalInfo?.contactInfo?.filter(
    info => !phoneRegex.test(info) && !simplePhoneRegex.test(info)
  ) || [];

  const phoneNumbers = optimizedResumeData?.personalInfo?.contactInfo?.filter(
    info => phoneRegex.test(info) || simplePhoneRegex.test(info)
  ) || [];

  // Remove "Cover Letter" title from markdown if it exists
  let cleanCoverLetterMarkdown = coverLetter.replace(/^#\s*Cover Letter\s*\n+/i, '').replace(/^#\s*Cover Letter\s*$/im, '');
  
  // Remove phone numbers from markdown
  phoneNumbers.forEach(phone => {
    cleanCoverLetterMarkdown = cleanCoverLetterMarkdown.replace(new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  });
  // Clean up any empty bullet points or extra separators left behind
  cleanCoverLetterMarkdown = cleanCoverLetterMarkdown.replace(/\|\s*\|/g, '|').replace(/•\s*•/g, '•');

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCoverLetterMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!letterRef.current) return;
    
    try {
      setIsGenerating(true);
      const element = letterRef.current;
      
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.clientHeight * pdfWidth) / element.clientWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Cover_Letter.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print if html-to-image fails
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto h-full flex flex-col print:space-y-0 print:block print:h-auto print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Cover Letter</h1>
          <p className="text-zinc-500 mt-1">A personalized cover letter tailored to the job description.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-sm mr-2">
            <button
              onClick={() => setTemplate('professional')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                template === 'professional' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Professional
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
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
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

      <div className="flex-1 overflow-auto bg-zinc-100 rounded-2xl border border-zinc-200 p-4 shadow-sm print:p-0 print:border-none print:shadow-none print:bg-white print:overflow-visible">
        <div className="shadow-sm border border-zinc-200 max-w-[800px] mx-auto min-h-full print:shadow-none print:border-none print:max-w-none print:m-0">
          <div ref={letterRef} className="bg-white min-h-full print:w-full">
            {template === 'professional' && coverLetterData && optimizedResumeData ? (
              <ProfessionalCoverLetter 
                data={coverLetterData} 
                senderName={optimizedResumeData.personalInfo.name}
                senderContact={filteredContactInfo}
              />
            ) : (
              <div className="p-10 prose prose-zinc max-w-none mx-auto">
                <Markdown>{cleanCoverLetterMarkdown}</Markdown>
              </div>
            )}
            {template === 'professional' && (!coverLetterData || !optimizedResumeData) && (
              <div className="p-10 text-center text-zinc-500">
                Structured data not available. Please run analysis again or use Markdown view.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

