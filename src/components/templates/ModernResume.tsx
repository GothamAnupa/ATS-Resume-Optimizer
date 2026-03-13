import { ResumeData } from '../../store/useResumeStore';
import { Calendar, Mail, Phone, Github, Linkedin, MapPin } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export function ModernResume({ data }: Props) {
  const accentColor = '#800000'; // Maroon

  const getIcon = (info: string) => {
    const lower = info.toLowerCase();
    if (lower.includes('@')) return <Mail className="w-3 h-3" />;
    if (lower.includes('github')) return <Github className="w-3 h-3" />;
    if (lower.includes('linkedin')) return <Linkedin className="w-3 h-3" />;
    if (lower.match(/\d/)) return <Phone className="w-3 h-3" />;
    return <MapPin className="w-3 h-3" />;
  };

  return (
    <div className="bg-white p-8 font-sans text-gray-800 grid grid-cols-12 gap-8">
      
      {/* Left Column (7/12) */}
      <div className="col-span-7 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-wide mb-3" style={{ color: '#1a1a1a' }}>
            {data.personalInfo.name}
          </h1>
          <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-600">
            {data.personalInfo.contactInfo.map((info, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                {getIcon(info)}
                {info}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>
              Work Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="text-sm">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-base" style={{ color: accentColor }}>{exp.title}</span>
                    <span className="font-semibold text-gray-700">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-medium">
                    <Calendar className="w-3 h-3" />
                    {exp.date}
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-gray-700">
                    {exp.points.map((point, i) => (
                      <li key={i} className="leading-relaxed">{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-bold text-gray-900 mb-2">{proj.name}</div>
                  <ul className="list-disc pl-4 space-y-1.5 text-gray-700">
                    {proj.points.map((point, i) => (
                      <li key={i} className="leading-relaxed">{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>
              Achievements
            </h2>
            <ul className="list-disc pl-4 space-y-1.5 text-sm text-gray-700">
              {data.achievements.map((ach, idx) => (
                <li key={idx} className="leading-relaxed">{ach}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Column (5/12) */}
      <div className="col-span-5 space-y-6">
        
        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-bold text-gray-900 mb-0.5">{edu.degree}</div>
                  <div className="text-xs mb-1.5" style={{ color: accentColor }}>{edu.school}</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3 h-3" />
                    {edu.date}
                    <span className="ml-2 font-semibold text-gray-700">{edu.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.flatMap(group => group.items).map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-md text-xs font-medium border"
                  style={{ borderColor: '#e5e7eb', color: '#4b5563', backgroundColor: '#f9fafb' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>
              Certifications
            </h2>
            <ul className="list-disc pl-4 space-y-2 text-sm text-gray-700">
              {data.certifications.map((cert, idx) => {
                // Try to split by colon to bold the title
                const parts = cert.split(':');
                if (parts.length > 1) {
                  return (
                    <li key={idx} className="leading-relaxed">
                      <span className="font-bold text-gray-900">{parts[0]}:</span>
                      {parts.slice(1).join(':')}
                    </li>
                  );
                }
                return <li key={idx} className="leading-relaxed">{cert}</li>;
              })}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
