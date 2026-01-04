"use client"

import { useState } from "react"
import { LectureRecorder } from "@/components/lecture-recorder"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  BrainCircuit,
  BookOpen,
  Clock,
  LogOut,
  LayoutDashboard,
  Search,
  Star,
  TrendingUp,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { QuizSystem } from "@/components/quiz-system"
import { Input } from "@/components/ui/input"
import { processLectureAudio } from "@/lib/gemini"
import { toast } from "sonner"

export default function Dashboard() {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState<"easy" | "medium" | "hard" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentView, setCurrentView] = useState<"dashboard" | "recent" | "analytics" | "studyMaterials">("dashboard")
  const [transcription, setTranscription] = useState<string | null>(null)

  const handleRecordingComplete = async (blob: Blob) => {
    setIsProcessing(true)
    setExplanation(null)
    setTranscription(null)
    
    try {
      console.log("Processing audio with Gemini...")
      
      // Process audio: transcribe and generate explanation
      const { transcription: transcribedText, explanation: generatedExplanation } = await processLectureAudio(blob)
      
      setTranscription(transcribedText)
      setExplanation(generatedExplanation)
      toast.success("Lecture processed successfully!")
    } catch (error) {
      console.error("Error processing audio:", error)
      toast.error(error instanceof Error ? error.message : "Failed to process audio. Please check your API key and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
        <div className="p-6">
          <Link className="flex items-center gap-2" href="/">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LectureLens</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("dashboard")}
            className={`w-full justify-start gap-2 ${currentView === "dashboard" ? "text-primary bg-primary/10" : ""}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentView("recent")}
            className={`w-full justify-start gap-2 ${currentView === "recent" ? "text-primary bg-primary/10" : ""}`}
          >
            <Clock className="h-4 w-4" /> Recent Lectures
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentView("studyMaterials")}
            className={`w-full justify-start gap-2 ${currentView === "studyMaterials" ? "text-primary bg-primary/10" : ""}`}
          >
            <BookOpen className="h-4 w-4" /> Study Materials
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentView("analytics")}
            className={`w-full justify-start gap-2 ${currentView === "analytics" ? "text-primary bg-primary/10" : ""}`}
          >
            <TrendingUp className="h-4 w-4" /> Analytics
          </Button>
        </nav>
        <div className="p-4 mt-auto border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lectures, concepts..."
                className="pl-8 bg-muted/50 border-none h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Semester 1 • Computer Science</span>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">JD</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {currentView === "analytics" ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Your Learning Analytics</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Study Hours</span>
                  </div>
                  <div className="text-3xl font-bold">24.5h</div>
                  <p className="text-xs text-green-600 mt-1">+12% from last week</p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <BrainCircuit className="h-4 w-4" />
                    <span className="text-sm font-medium">Mastery Level</span>
                  </div>
                  <div className="text-3xl font-bold">82%</div>
                  <p className="text-xs text-primary mt-1">Advanced Learner</p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Quizzes Taken</span>
                  </div>
                  <div className="text-3xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground mt-1">4 pending analysis</p>
                </Card>
              </div>
              <Card className="p-8 flex items-center justify-center h-64 border-dashed">
                <p className="text-muted-foreground">Interactive Learning Graph Coming Soon</p>
              </Card>
            </div>
          ) : currentView === "studyMaterials" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Materials</span>
                  </div>
                  <div className="text-3xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground mt-1">Lectures & Notes</p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Starred Items</span>
                  </div>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-primary mt-1">Important materials</p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <div className="text-3xl font-bold">2h</div>
                  <p className="text-xs text-muted-foreground mt-1">ago</p>
                </Card>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Deep Learning Fundamentals", subject: "Machine Learning", date: "2 hours ago", type: "Lecture" },
                    { title: "Neural Network Architecture", subject: "AI & ML", date: "Yesterday", type: "Notes" },
                    { title: "Backpropagation Explained", subject: "Machine Learning", date: "2 days ago", type: "Summary" },
                    { title: "Gradient Descent Optimization", subject: "Deep Learning", date: "3 days ago", type: "Lecture" },
                  ].map((item, i) => (
                    <Card key={i} className="p-4 hover:border-primary/50 cursor-pointer transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{item.subject}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </Card>
                  ))}
                </div>
              </div>
              <Card className="p-8 flex items-center justify-center h-64 border-dashed">
                <div className="text-center space-y-2">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Upload or organize your study materials</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Material
                  </Button>
                </div>
              </Card>
            </div>
          ) : activeQuiz ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Challenge Yourself</h1>
                <Button variant="ghost" onClick={() => setActiveQuiz(null)}>
                  Cancel Quiz
                </Button>
              </div>
              <QuizSystem difficulty={activeQuiz} transcription={transcription} onExit={() => setActiveQuiz(null)} />
            </div>
          ) : !explanation && !isProcessing ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">Capture Your Knowledge</h1>
                  <p className="text-muted-foreground">Record your lecture to get an instant AI-powered explanation.</p>
                </div>
              </div>

              <LectureRecorder onRecordingComplete={handleRecordingComplete} />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Recent Successes</h3>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Intro to Neural Networks", date: "2 hours ago", mastery: "High" },
                    { title: "Backpropagation Theory", date: "Yesterday", mastery: "Medium" },
                  ].map((item, i) => (
                    <Card
                      key={i}
                      className="p-4 hover:border-primary/50 cursor-pointer transition-all group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.mastery === "High" ? "bg-green-500" : "bg-yellow-500"}`}
                            style={{ width: item.mastery === "High" ? "85%" : "45%" }}
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.mastery}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Lecture Analysis</h1>
                <Button variant="outline" onClick={() => setExplanation(null)}>
                  Record New
                </Button>
              </div>

              {isProcessing ? (
                <Card className="p-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <BrainCircuit className="h-12 w-12 text-primary animate-pulse" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-ping" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">Gemini is analyzing your audio...</h3>
                    <p className="text-muted-foreground">Generating a well-explained summary and concepts.</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuit className="h-5 w-5 text-primary" />
                          AI Explanation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
                        <div className="whitespace-pre-line leading-relaxed">{explanation}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Knowledge Check</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Ready to test what you just learned? Choose a level to start the quiz.
                        </p>
                        <div className="grid gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setActiveQuiz("easy")}
                            className="justify-between border-green-500/30 hover:bg-green-50 text-green-700 dark:text-green-400 bg-transparent"
                          >
                            Easy Mode <span className="text-xs font-normal opacity-70">Foundations</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setActiveQuiz("medium")}
                            className="justify-between border-yellow-500/30 hover:bg-yellow-50 text-yellow-700 dark:text-yellow-400 bg-transparent"
                          >
                            Medium Mode <span className="text-xs font-normal opacity-70">Applications</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setActiveQuiz("hard")}
                            className="justify-between border-red-500/30 hover:bg-red-50 text-red-700 dark:text-red-400 bg-transparent"
                          >
                            Hard Mode <span className="text-xs font-normal opacity-70">Deep Theory</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Vocabulary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between border-b pb-1">
                            <span className="font-semibold">Stochastic</span>
                            <span className="text-muted-foreground">Randomly determined</span>
                          </li>
                          <li className="flex justify-between border-b pb-1">
                            <span className="font-semibold">Convergence</span>
                            <span className="text-muted-foreground">Meeting at a point</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-semibold">Epoch</span>
                            <span className="text-muted-foreground">Full pass through data</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
