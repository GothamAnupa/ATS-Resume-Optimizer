import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, LayoutDashboard, Sparkles, FileSignature, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import { useResumeStore } from '../store/useResumeStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { analysisResult } = useResumeStore();

  const navItems = [
    { name: 'Workspace', path: '/input', icon: Upload },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, disabled: !analysisResult },
    { name: 'Suggestions', path: '/suggestions', icon: Sparkles, disabled: !analysisResult },
    { name: 'Cover Letter', path: '/cover-letter', icon: FileSignature, disabled: !analysisResult },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans print:h-auto print:bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shadow-sm z-10 print:hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">AI Resume Opt</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 cursor-not-allowed"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50" 
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Powered by Gemini
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-zinc-50/50 print:overflow-visible print:bg-white">
        <div className="h-full p-8 print:p-0 print:h-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

