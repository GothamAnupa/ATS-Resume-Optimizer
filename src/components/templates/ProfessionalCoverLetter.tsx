import { CoverLetterData } from '../../store/useResumeStore';

interface Props {
  data: CoverLetterData;
  senderName: string;
  senderContact: string[];
}

export function ProfessionalCoverLetter({ data, senderName, senderContact }: Props) {
  return (
    <div className="bg-white font-serif text-gray-800">
      
      {/* Header Block */}
      <div className="bg-slate-600 text-white py-12 px-8 text-center">
        <h1 className="text-5xl font-bold italic tracking-wide mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
          {senderName}
        </h1>
        <div className="text-sm flex flex-wrap justify-center items-center gap-3 text-slate-200 font-sans">
          {senderContact.map((info, idx) => (
            <span key={idx} className="flex items-center gap-3">
              {info}
              {idx < senderContact.length - 1 && <span>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-12 space-y-6 text-sm leading-relaxed text-justify">
        
        {/* Date and Recipient */}
        <div className="space-y-4 mb-8">
          <p>{data.date}</p>
          <div>
            <p className="font-bold">{data.recipientName}</p>
            <p>{data.recipientTitle}</p>
            <p>{data.companyName}</p>
            <p>{data.companyAddress}</p>
          </div>
        </div>

        {/* Salutation */}
        <p className="font-bold">{data.salutation}</p>

        {/* Paragraphs */}
        <div className="space-y-4">
          {data.bodyParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Sign Off */}
        <div className="pt-8 space-y-4">
          <p>{data.signOff}</p>
          <p className="font-bold">{senderName}</p>
          
          {/* Signature Font */}
          <div className="text-4xl pt-2 text-slate-700" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {senderName}
          </div>
        </div>

      </div>
    </div>
  );
}
