import { ResumeData } from '../../store/useResumeStore';

interface Props {
  data: ResumeData;
}

export function ClassicResume({ data }: Props) {
  return (
    <div className="bg-white p-8 font-serif text-black">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.name}</h1>
        <div className="text-sm flex flex-wrap justify-center items-center gap-2 text-gray-800">
          {data.personalInfo.contactInfo.map((info, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {info}
              {idx < data.personalInfo.contactInfo.length - 1 && <span>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between font-bold">
                  <span>{edu.degree}</span>
                  <span>{edu.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span>{edu.school}</span>
                  <span>{edu.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Work Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between font-bold mb-1">
                  <span>{exp.title} - {exp.company}</span>
                  <span>{exp.date}</span>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-justify leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="text-sm">
                <div className="font-bold mb-1">{proj.name}</div>
                <ul className="list-disc pl-5 space-y-1">
                  {proj.points.map((point, i) => (
                    <li key={i} className="text-justify leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Technical Skills</h2>
          <div className="space-y-1 text-sm">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx}>
                <span className="font-bold">{skillGroup.category}: </span>
                <span>{skillGroup.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Certifications</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {data.certifications.map((cert, idx) => (
              <li key={idx} className="text-justify">{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Achievements</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {data.achievements.map((ach, idx) => (
              <li key={idx} className="text-justify">{ach}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
