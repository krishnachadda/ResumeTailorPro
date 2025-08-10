"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  Download,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Brain,
  Users,
  BarChart3,
  Eye,
  Wand2,
  Shield,
  Settings,
  Plus,
  Edit,
  Share2,
  History,
  Building2,
  Briefcase,
  GraduationCap,
  Code,
  Palette,
  Stethoscope,
  Scale,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  avatar?: string
}

interface IndustryTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  keywords: string[]
  toneGuidelines: string
  customPrompt: string
  atsOptimizations: string[]
  sampleAchievements: string[]
}

interface GeneratedContent {
  resume: string
  coverLetter: string
  analysis: {
    matchScore: number
    keyStrengths: string[]
    skillGaps: string[]
    recommendations: string[]
    atsScore: number
    industryFit: string
    confidenceScore: number
    improvementAreas: string[]
  }
  metadata: {
    generatedAt: string
    template: string
    industry: string
    version: number
  }
}

const industryTemplates: IndustryTemplate[] = [
  {
    id: "technology",
    name: "Technology & Software",
    description: "Optimized for software engineers, developers, and tech professionals",
    icon: <Code className="h-5 w-5" />,
    keywords: ["agile", "scrum", "API", "cloud", "DevOps", "full-stack", "microservices", "CI/CD"],
    toneGuidelines: "Technical, results-driven, innovation-focused",
    customPrompt: "Emphasize technical skills, project impact, and scalability achievements",
    atsOptimizations: ["Technical skills section", "Project-based experience", "Quantified performance metrics"],
    sampleAchievements: ["Reduced load time by 40%", "Implemented CI/CD pipeline", "Led team of 5 developers"],
  },
  {
    id: "finance",
    name: "Finance & Banking",
    description: "Tailored for financial analysts, bankers, and investment professionals",
    icon: <TrendingUp className="h-5 w-5" />,
    keywords: ["ROI", "P&L", "risk management", "compliance", "portfolio", "financial modeling", "due diligence"],
    toneGuidelines: "Professional, analytical, detail-oriented",
    customPrompt: "Highlight financial impact, regulatory knowledge, and analytical skills",
    atsOptimizations: ["Quantified financial results", "Regulatory compliance experience", "Risk assessment skills"],
    sampleAchievements: ["Managed $50M portfolio", "Reduced costs by 25%", "Ensured 100% regulatory compliance"],
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    description: "Designed for healthcare professionals, doctors, and medical staff",
    icon: <Stethoscope className="h-5 w-5" />,
    keywords: [
      "patient care",
      "clinical",
      "EMR",
      "HIPAA",
      "quality improvement",
      "evidence-based",
      "interdisciplinary",
    ],
    toneGuidelines: "Compassionate, professional, patient-focused",
    customPrompt: "Emphasize patient outcomes, clinical expertise, and healthcare quality improvements",
    atsOptimizations: ["Clinical certifications", "Patient outcome metrics", "Healthcare technology proficiency"],
    sampleAchievements: ["Improved patient satisfaction by 30%", "Reduced readmission rates", "Led quality initiative"],
  },
  {
    id: "creative",
    name: "Creative & Design",
    description: "Perfect for designers, marketers, and creative professionals",
    icon: <Palette className="h-5 w-5" />,
    keywords: ["brand identity", "user experience", "creative strategy", "visual design", "campaign", "engagement"],
    toneGuidelines: "Creative, innovative, brand-conscious",
    customPrompt: "Showcase creative impact, brand results, and innovative solutions",
    atsOptimizations: ["Portfolio highlights", "Brand impact metrics", "Creative tool proficiency"],
    sampleAchievements: ["Increased brand engagement by 60%", "Won design award", "Led rebranding initiative"],
  },
  {
    id: "education",
    name: "Education & Academia",
    description: "Optimized for educators, researchers, and academic professionals",
    icon: <GraduationCap className="h-5 w-5" />,
    keywords: ["curriculum", "pedagogy", "research", "publications", "grants", "student outcomes", "assessment"],
    toneGuidelines: "Scholarly, evidence-based, student-centered",
    customPrompt: "Highlight educational impact, research contributions, and student success",
    atsOptimizations: ["Teaching philosophy", "Research publications", "Student achievement data"],
    sampleAchievements: ["Published 15 research papers", "Improved test scores by 25%", "Secured $500K grant"],
  },
  {
    id: "legal",
    name: "Legal & Law",
    description: "Tailored for lawyers, paralegals, and legal professionals",
    icon: <Scale className="h-5 w-5" />,
    keywords: ["litigation", "compliance", "contract negotiation", "legal research", "case management", "regulatory"],
    toneGuidelines: "Precise, authoritative, detail-oriented",
    customPrompt: "Emphasize legal expertise, case outcomes, and regulatory knowledge",
    atsOptimizations: ["Legal specializations", "Case win rates", "Regulatory compliance"],
    sampleAchievements: ["Won 85% of cases", "Negotiated $10M settlement", "Ensured regulatory compliance"],
  },
]

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: "2", name: "Mike Chen", email: "mike@company.com", role: "editor" },
  { id: "3", name: "Emily Davis", email: "emily@company.com", role: "editor" },
  { id: "4", name: "Alex Rodriguez", email: "alex@company.com", role: "viewer" },
]

export default function TeamResumeGenerator() {
  const [activeTab, setActiveTab] = useState("generator")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [linkedinProfile, setLinkedinProfile] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("technology")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [useLinkedIn, setUseLinkedIn] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)

  const selectedTemplate = industryTemplates.find((t) => t.id === selectedIndustry) || industryTemplates[0]

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setResumeFile(file)
    setError("")
    setUploadProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const text = await extractTextFromFile(file)
      setResumeText(text)
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 2000)
    } catch (err) {
      setError("Failed to extract text from file. Please try again.")
      setUploadProgress(0)
    }
  }, [])

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text)
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const generateContent = async () => {
    const inputText = useLinkedIn ? linkedinProfile : resumeText

    if (!inputText.trim() || !jobDescription.trim()) {
      setError("Please provide both resume/LinkedIn content and job description.")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: inputText,
          jobDescription: jobDescription,
          industry: selectedIndustry,
          experienceLevel: experienceLevel,
          customPrompt: customPrompt || selectedTemplate.customPrompt,
          template: selectedTemplate,
          useLinkedIn: useLinkedIn,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data)
    } catch (err) {
      setError("Failed to generate customized content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadContent = (content: string, filename: string, format: "txt" | "pdf" = "txt") => {
    const blob = new Blob([content], { type: format === "pdf" ? "application/pdf" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  TeamResume Pro
                </h1>
                <p className="text-sm text-gray-500">Enterprise Resume & Cover Letter Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {teamMembers.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="h-8 w-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{teamMembers.length - 3}</span>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                Team Plan
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Resume/LinkedIn Input */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-blue-600" />
                        Resume or LinkedIn Profile
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="linkedin-toggle" className="text-sm">
                          LinkedIn Profile
                        </Label>
                        <Switch id="linkedin-toggle" checked={useLinkedIn} onCheckedChange={setUseLinkedIn} />
                      </div>
                    </div>
                    <CardDescription>
                      {useLinkedIn ? "Paste your LinkedIn profile content" : "Upload resume file or paste content"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!useLinkedIn ? (
                      <>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Input
                            type="file"
                            accept=".txt,.pdf,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resume-upload"
                          />
                          <Label htmlFor="resume-upload" className="cursor-pointer">
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-blue-600" />
                              <p className="text-sm font-medium">Upload Resume</p>
                              <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
                            </div>
                          </Label>
                        </div>

                        {uploadProgress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Processing...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} />
                          </div>
                        )}

                        <Separator />

                        <Textarea
                          placeholder="Or paste your resume content here..."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          rows={8}
                        />
                      </>
                    ) : (
                      <Textarea
                        placeholder="Paste your LinkedIn profile content here including summary, experience, skills, and education..."
                        value={linkedinProfile}
                        onChange={(e) => setLinkedinProfile(e.target.value)}
                        rows={12}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Job Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Target Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Paste the complete job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={10}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Configuration Panel */}
              <div className="space-y-6">
                {/* Industry Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Industry Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industryTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              {template.icon}
                              {template.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedTemplate.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedTemplate.keywords.slice(0, 4).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Experience Level</Label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-7 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (8-15 years)</SelectItem>
                          <SelectItem value="executive">Executive (15+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Prompt */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Custom Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={`Default: ${selectedTemplate.customPrompt}`}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Override default template instructions with custom guidance
                    </p>
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <Button
                  onClick={generateContent}
                  disabled={isGenerating || (!resumeText.trim() && !linkedinProfile.trim()) || !jobDescription.trim()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Documents
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {generatedContent && (
              <div className="space-y-6">
                {/* Analysis Dashboard */}
                <div className="grid md:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(generatedContent.analysis.matchScore)}`}>
                        {generatedContent.analysis.matchScore}%
                      </div>
                      <p className="text-sm text-gray-600">Job Match</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(generatedContent.analysis.atsScore)}`}>
                        {generatedContent.analysis.atsScore}%
                      </div>
                      <p className="text-sm text-gray-600">ATS Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(generatedContent.analysis.confidenceScore)}`}>
                        {generatedContent.analysis.confidenceScore}%
                      </div>
                      <p className="text-sm text-gray-600">Confidence</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {generatedContent.analysis.keyStrengths.length}
                      </div>
                      <p className="text-sm text-gray-600">Strengths</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">v{generatedContent.metadata.version}</div>
                      <p className="text-sm text-gray-600">Version</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Generated Documents */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Generated Documents</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share with Team
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="mr-2 h-4 w-4" />
                          Version History
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="resume">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="resume">Optimized Resume</TabsTrigger>
                        <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                      </TabsList>

                      <TabsContent value="resume" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Customized Resume</h3>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => downloadContent(generatedContent.resume, "resume", "txt")}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              TXT
                            </Button>
                            <Button onClick={() => downloadContent(generatedContent.resume, "resume", "pdf")} size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              PDF
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{generatedContent.resume}</pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="cover-letter" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Cover Letter</h3>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => downloadContent(generatedContent.coverLetter, "cover-letter", "txt")}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              TXT
                            </Button>
                            <Button
                              onClick={() => downloadContent(generatedContent.coverLetter, "cover-letter", "pdf")}
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              PDF
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{generatedContent.coverLetter}</pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Industry Templates</h2>
                <p className="text-gray-600">Customize and fine-tune templates for different industries and roles</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Key Keywords</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.keywords.slice(0, 6).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Tone Guidelines</Label>
                      <p className="text-sm text-gray-600 mt-1">{template.toneGuidelines}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">ATS Optimizations</Label>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        {template.atsOptimizations.slice(0, 2).map((opt, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Team Management</h2>
                <p className="text-gray-600">Manage team members and their access levels</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage roles and permissions for your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === "admin" ? "default" : "secondary"} className="gap-1">
                          {getRoleIcon(member.role)}
                          {member.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics & Insights</h2>
              <p className="text-gray-600">Track team performance and resume generation metrics</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <p className="text-sm text-gray-600">Resumes Generated</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <p className="text-sm text-gray-600">Avg ATS Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <p className="text-sm text-gray-600">Cover Letters</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <p className="text-sm text-gray-600">Active Templates</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryTemplates.slice(0, 4).map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(4 - index) * 25}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{(4 - index) * 25}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
