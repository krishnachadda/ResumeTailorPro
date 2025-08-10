import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const responseSchema = z.object({
  resume: z.string().describe("The customized resume content"),
  coverLetter: z.string().describe("The personalized cover letter content"),
})

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription } = await req.json()

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: responseSchema,
      prompt: `You are an expert resume writer and career coach. Your task is to customize a resume and create a cover letter based on a specific job description.

ORIGINAL RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Please provide:

1. CUSTOMIZED RESUME: Rewrite the resume to better match the job requirements by:
   - Highlighting relevant skills and experience that match the job description
   - Adjusting the professional summary to align with the role
   - Reordering or emphasizing experience that's most relevant
   - Using keywords from the job description naturally
   - Maintaining the original structure and formatting style
   - Keeping all factual information accurate

2. COVER LETTER: Create a professional cover letter that:
   - Addresses the specific role and company (if mentioned)
   - Highlights 2-3 key qualifications that match the job requirements
   - Shows enthusiasm for the position
   - Maintains a professional yet personable tone
   - Is concise (3-4 paragraphs)
   - Includes a strong opening and closing

Format both documents professionally and ensure they complement each other while targeting this specific opportunity.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
