import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const responseSchema = z.object({
  resume: z.string().describe("The professionally customized resume content with optimal formatting"),
  coverLetter: z.string().describe("The personalized cover letter content"),
  analysis: z.object({
    matchScore: z.number().min(0).max(100).describe("Percentage match between resume and job requirements"),
    keyStrengths: z.array(z.string()).describe("Top 3-5 strengths that align with the job"),
    skillGaps: z.array(z.string()).describe("Areas for improvement or missing skills"),
    recommendations: z.array(z.string()).describe("Specific actionable recommendations"),
    atsScore: z.number().min(0).max(100).describe("ATS (Applicant Tracking System) compatibility score"),
    industryFit: z.string().describe("How well the resume fits the target industry"),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription, template, industry, experienceLevel } = await req.json()

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: responseSchema,
      prompt: `You are an elite resume writer and career strategist with 20+ years of experience helping professionals land their dream jobs. You specialize in ATS optimization, industry-specific customization, and creating compelling narratives that get results.

CONTEXT:
- Template: ${template}
- Target Industry: ${industry || "Not specified"}
- Experience Level: ${experienceLevel || "Not specified"}

ORIGINAL RESUME:
${resume}

TARGET JOB DESCRIPTION:
${jobDescription}

TASK: Create a comprehensive professional package including:

1. **OPTIMIZED RESUME** - Transform the resume with:
   - Strategic keyword integration from job description (natural placement)
   - Quantified achievements with specific metrics and impact
   - Industry-specific terminology and buzzwords
   - ATS-friendly formatting and structure
   - Compelling professional summary tailored to the role
   - Skills section optimized for both ATS and human readers
   - Experience descriptions that highlight relevant accomplishments
   - Education and certifications positioned strategically
   - Clean, professional formatting that passes ATS systems

2. **PERSONALIZED COVER LETTER** - Craft a compelling letter that:
   - Opens with a strong hook that demonstrates knowledge of the company/role
   - Highlights 2-3 key achievements that directly address job requirements
   - Shows genuine enthusiasm and cultural fit
   - Addresses any potential concerns (career gaps, transitions, etc.)
   - Includes a confident call-to-action
   - Maintains professional yet personable tone
   - Is concise but impactful (3-4 paragraphs)

3. **COMPREHENSIVE ANALYSIS** - Provide detailed insights:
   - **Match Score**: Realistic assessment of resume-job alignment (0-100%)
   - **Key Strengths**: Top 3-5 strengths that make this candidate stand out
   - **Skill Gaps**: Areas where the candidate could improve or add skills
   - **Recommendations**: Specific, actionable advice for improvement
   - **ATS Score**: Technical compatibility score for applicant tracking systems
   - **Industry Fit**: Assessment of how well the resume aligns with industry standards

QUALITY STANDARDS:
- Use power verbs and action-oriented language
- Include specific metrics, percentages, and quantifiable results
- Ensure keyword density is natural, not stuffed
- Maintain consistency in formatting and style
- Focus on achievements over responsibilities
- Tailor content to the specific role and company
- Ensure both documents work together as a cohesive application package

Make this a winning combination that will get the candidate noticed, interviewed, and hired.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating professional content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
