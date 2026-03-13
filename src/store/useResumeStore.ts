import { create } from 'zustand';

export interface SectionAnalysis {
  sectionName: string;
  matchScore: number;
  whyItFits: string[];
  whyItDoesNotMatch: string[];
  missingKeywords: string[];
  suggestions: string[];
  improvedExample: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    contactInfo: string[];
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    date: string;
    points: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    date: string;
    grade: string;
  }>;
  projects: Array<{
    name: string;
    points: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  certifications: string[];
  achievements: string[];
}

export interface CoverLetterData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  salutation: string;
  bodyParagraphs: string[];
  signOff: string;
}

export interface AnalysisResult {
  overallFitScore: number;
  overallReasonsForFit: string[];
  overallReasonsForNotFit: string[];
  overallMissingRequirements: string[];
  sectionsAnalysis: SectionAnalysis[];
  optimizedResume: string; // Keep for backward compatibility or raw markdown
  coverLetter: string; // Keep for backward compatibility
  optimizedResumeData: ResumeData;
  coverLetterData: CoverLetterData;
}

interface ResumeStore {
  baseResume: string;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  setBaseResume: (resume: string) => void;
  setJobDescription: (jd: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  baseResume: '',
  jobDescription: '',
  analysisResult: null,
  isAnalyzing: false,
  setBaseResume: (baseResume) => set({ baseResume }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  reset: () => set({ baseResume: '', jobDescription: '', analysisResult: null, isAnalyzing: false }),
}));

