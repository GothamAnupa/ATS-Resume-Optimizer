import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../store/useResumeStore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeAndOptimizeResume(
  baseResume: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const prompt = `
You are an expert technical recruiter and resume writer.
I will provide you with a Job Description and a Base Resume.

Your task is to:
1. Analyze the overall fit between the resume and the job description. Provide an overall Job Fit Score (0-100), reasons for fit, reasons for not fit, and key missing requirements.
2. Provide a section-by-section analysis for the following sections: Professional Summary, Skills, Work Experience, Projects, Education.
   For each section, provide:
   - Match Score (0-100)
   - Why it fits the job
   - Why it does NOT match
   - Missing keywords
   - Suggestions for improvement
   - Example improved version (For Education, just provide an empty string as it shouldn't be modified).
3. Rewrite the resume to better align with the job description.
   CRITICAL RULES FOR REWRITING:
   - NEVER modify the candidate's Name, Education details, College/University name, Degree information, or Contact details.
   - ONLY optimize the Skills, Work Experience descriptions, Project descriptions, and Summary/About section.
   - The rewritten resume MUST sound natural and human-written, not AI-generated.
   - Only improve relevant parts.
   - You MUST provide the optimized resume as a structured JSON object (optimizedResumeData) AND as a Markdown string (optimizedResume).
4. Generate a personalized cover letter based on the job description and the candidate's experience.
   - The cover letter should sound professional and human.
   - It should be tailored to the job role.
   - Highlight relevant projects and skills from the resume.
   - DO NOT include a title like "Cover Letter" at the top of the markdown.
   - DO NOT include the candidate's phone number anywhere in the cover letter or its header.
   - You MUST provide the cover letter as a structured JSON object (coverLetterData) AND as a Markdown string (coverLetter).
   - If recipient details are unknown, use placeholders like "[Hiring Manager]" or "[Company Name]".

Job Description:
${jobDescription}

Base Resume:
${baseResume}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallFitScore: {
            type: Type.NUMBER,
            description: "Overall Job Fit Score from 0 to 100",
          },
          overallReasonsForFit: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Reasons why the candidate is a good fit",
          },
          overallReasonsForNotFit: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Reasons why the candidate may not be a strong fit",
          },
          overallMissingRequirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key missing requirements",
          },
          sectionsAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sectionName: { type: Type.STRING, description: "Name of the section (e.g., Skills, Work Experience)" },
                matchScore: { type: Type.NUMBER, description: "Match Score for this section (0-100)" },
                whyItFits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Why this section fits the job" },
                whyItDoesNotMatch: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Why this section does not fully match" },
                missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Missing keywords in this section" },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggestions for improvement" },
                improvedExample: { type: Type.STRING, description: "Example improved version of this section" },
              },
              required: ["sectionName", "matchScore", "whyItFits", "whyItDoesNotMatch", "missingKeywords", "suggestions", "improvedExample"]
            },
            description: "Section-by-section analysis",
          },
          optimizedResume: {
            type: Type.STRING,
            description: "The rewritten resume in Markdown format",
          },
          coverLetter: {
            type: Type.STRING,
            description: "The generated cover letter in Markdown format",
          },
          optimizedResumeData: {
            type: Type.OBJECT,
            description: "The rewritten resume as structured data",
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  contactInfo: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "contactInfo"]
              },
              summary: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    date: { type: Type.STRING },
                    points: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "company", "date", "points"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    school: { type: Type.STRING },
                    date: { type: Type.STRING },
                    grade: { type: Type.STRING }
                  },
                  required: ["degree", "school", "date", "grade"]
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    points: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "points"]
                }
              },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["category", "items"]
                }
              },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["personalInfo", "summary", "experience", "education", "projects", "skills", "certifications", "achievements"]
          },
          coverLetterData: {
            type: Type.OBJECT,
            description: "The generated cover letter as structured data",
            properties: {
              recipientName: { type: Type.STRING },
              recipientTitle: { type: Type.STRING },
              companyName: { type: Type.STRING },
              companyAddress: { type: Type.STRING },
              date: { type: Type.STRING },
              salutation: { type: Type.STRING },
              bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
              signOff: { type: Type.STRING }
            },
            required: ["recipientName", "recipientTitle", "companyName", "companyAddress", "date", "salutation", "bodyParagraphs", "signOff"]
          }
        },
        required: [
          "overallFitScore",
          "overallReasonsForFit",
          "overallReasonsForNotFit",
          "overallMissingRequirements",
          "sectionsAnalysis",
          "optimizedResume",
          "coverLetter",
          "optimizedResumeData",
          "coverLetterData"
        ],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Failed to parse AI response");
  }
}
