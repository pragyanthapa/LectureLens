import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, BookOpen, BrainCircuit, LayoutGrid, Zap, ShieldCheck, ChevronRight, PlayCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="px-6 h-20 flex items-center justify-between border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center gap-2.5 group" href="/">
          <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">LectureLens</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="#how-it-works">
            How it Works
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent -z-10" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <BrainCircuit className="h-4 w-4" />
                <span>Next-Gen AI Learning Platform</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none max-w-4xl text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Master Any Lecture with <span className="text-primary italic">Precision</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground md:text-2xl text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
                Capture every word, receive instant deep-dive summaries from Gemini AI, and crush your exams with
                personalized, adaptive study paths.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 mt-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
                <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/20" asChild>
                  <Link href="/dashboard">
                    Join <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg bg-background border-2">
                  <PlayCircle className="mr-2 h-5 w-5" /> Watch the Future
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">Built for the Modern Learner</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
                LectureLens isn't just a recorder—it's your private academic researcher that attends every class with
                you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Mic,
                  title: "Intelligent Capture",
                  desc: "Studio-quality recording that filters out background noise, focusing purely on the lecturer's voice.",
                },
                {
                  icon: BrainCircuit,
                  title: "Gemini Analysis",
                  desc: "Complex concepts are broken down into easy-to-understand, structured mental models within seconds.",
                },
                {
                  icon: LayoutGrid,
                  title: "Triple-Tier Quizzes",
                  desc: "Move from foundational facts to deep theoretical application with our Easy, Medium, and Hard quiz paths.",
                },
                {
                  icon: Zap,
                  title: "Instant Insights",
                  desc: "No more re-watching hours of video. Get the core value of a 90-minute lecture in a 5-minute read.",
                },
                {
                  icon: BookOpen,
                  title: "Smart Organization",
                  desc: "Automatic tagging and categorization by subject, making your entire semester searchable.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verified Accuracy",
                  desc: "Cross-referenced AI responses that prioritize academic integrity and factual precision.",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="group p-8 flex flex-col items-start space-y-5 border-none shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background"
                >
                  <div className="p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 border-t border-border/40">
        <div className="container px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Mic className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold tracking-tight">LectureLens</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2026 LectureLens platform. Built for the next generation of excellence.
          </p>
          <nav className="flex gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
