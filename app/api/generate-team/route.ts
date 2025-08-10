import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const responseSchema = z.object({
  resume: z.string().describe("The professionally customized resume content"),
  coverLetter: z.string().describe("The personalized cover letter content"),
  analysis: z.object({
    matchScore: z.number().min(0).max(100).describe("Job match percentage"),
    keyStrengths: z.array(z.string()).describe("Top 3-5 key strengths"),
    skillGaps: z.array(z.string()).describe("Areas for improvement"),
    recommendations: z.array(z.string()).describe("Specific recommendations"),
    atsScore: z.number().min(0).max(100).describe("ATS compatibility score"),
    industryFit: z.string().describe("Industry alignment assessment"),
    confidenceScore: z.number().min(0).max(100).describe("Overall confidence in match"),
    improvementAreas: z.array(z.string()).describe("Areas that need improvement"),
  }),
  metadata: z.object({
    generatedAt: z.string().describe("Generation timestamp"),
    template: z.string().describe("Template used"),
    industry: z.string().describe("Target industry"),
    version: z.number().describe("Version number"),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription, industry, experienceLevel, customPrompt, template, useLinkedIn } = await req.json()

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: responseSchema,
      prompt: `You are an elite team-based resume optimization AI with expertise in ${industry} industry recruitment and ATS systems. You work with HR teams and career coaches to create winning resumes.

TEAM CONTEXT:
- Industry Focus: ${industry}
- Experience Level: ${experienceLevel || "Not specified"}
- Input Type: ${useLinkedIn ? "LinkedIn Profile" : "Resume"}
- Custom Instructions: ${customPrompt}

INDUSTRY TEMPLATE GUIDELINES:
- Keywords: ${template.keywords.join(", ")}
- Tone: ${template.toneGuidelines}
- ATS Optimizations: ${template.atsOptimizations.join(", ")}

ORIGINAL ${useLinkedIn ? "LINKEDIN PROFILE" : "RESUME"}:
${resume}

TARGET JOB DESCRIPTION:
${jobDescription}

MISSION: Create a comprehensive professional package that maximizes interview potential:

1. **INDUSTRY-OPTIMIZED RESUME**:
   - Strategic keyword integration (${template.keywords.slice(0, 8).join(", ")})
   - Industry-specific formatting and structure
   - Quantified achievements with metrics and impact
   - ATS-friendly optimization for ${industry} sector
   - Professional summary tailored to role requirements
   - Skills section optimized for industry standards
   - Experience descriptions highlighting relevant accomplishments
   - Education and certifications positioned strategically

2. **COMPELLING COVER LETTER**:
   - Industry-appropriate opening that demonstrates sector knowledge
   - 2-3 key achievements directly addressing job requirements
   - Tone matching ${template.toneGuidelines}
   - Company research integration (when available)
   - Confident call-to-action
   - Professional yet engaging language
   - Concise but impactful (3-4 paragraphs)

3. **COMPREHENSIVE TEAM ANALYSIS**:
   - **Match Score**: Realistic job-resume alignment (0-100%)
   - **Key Strengths**: Top 3-5 competitive advantages
   - **Skill Gaps**: Missing or weak areas needing attention
   - **Recommendations**: Actionable improvement strategies
   - **ATS Score**: Technical compatibility for ${industry} ATS systems
   - **Industry Fit**: Alignment with ${industry} standards and expectations
   - **Confidence Score**: Overall hiring potential assessment
   - **Improvement Areas**: Specific areas for enhancement

QUALITY STANDARDS FOR ${industry.toUpperCase()}:
- Use ${industry}-specific terminology and buzzwords naturally
- Include quantifiable results and metrics relevant to ${industry}
- Ensure keyword density is optimized but natural
- Focus on achievements over responsibilities
- Maintain consistency with ${industry} formatting standards
- Address ${industry}-specific challenges and solutions
- Demonstrate understanding of ${industry} trends and requirements

TEAM COLLABORATION NOTES:
- Ensure consistency with team templates and standards
- Provide actionable feedback for team review
- Include version control metadata
- Optimize for team workflow and approval processes

Create a winning combination that will get this candidate noticed, interviewed, and hired in the ${industry} sector.`,
    })

    // Add metadata
    const enrichedObject = {
      ...object,
      metadata: {
        generatedAt: new Date().toISOString(),
        template: template.name,
        industry: industry,
        version: 1,
      },
    }

    return NextResponse.json(enrichedObject)
  } catch (error) {
    console.error("Error generating team content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
