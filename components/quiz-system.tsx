"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, ArrowRight, Trophy, Loader2 } from "lucide-react"
import { generateQuizQuestions } from "@/lib/gemini"
import { toast } from "sonner"

type Difficulty = "easy" | "medium" | "hard"

export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

interface QuizSystemProps {
  difficulty: Difficulty
  transcription: string | null
  onExit: () => void
}

export function QuizSystem({ difficulty, transcription, onExit }: QuizSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQuestions = async () => {
      if (!transcription) {
        toast.error("No transcription available. Please record a lecture first.")
        onExit()
        return
      }

      setIsLoading(true)
      try {
        const generatedQuestions = await generateQuizQuestions(transcription, difficulty, 3)
        const questionsWithIds = generatedQuestions.map((q, index) => ({
          ...q,
          id: index + 1,
        }))
        setQuestions(questionsWithIds)
      } catch (error) {
        console.error("Error generating quiz questions:", error)
        toast.error("Failed to generate quiz questions. Please try again.")
        onExit()
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [difficulty, transcription, onExit])

  if (isLoading) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Generating Quiz Questions...</h3>
          <p className="text-muted-foreground">Creating {difficulty} level questions based on your lecture.</p>
        </div>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">No Questions Available</h2>
          <p className="text-muted-foreground">Unable to generate quiz questions. Please try again.</p>
        </div>
        <Button variant="outline" onClick={onExit}>
          Back to Dashboard
        </Button>
      </Card>
    )
  }
  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleSelect = (index: number) => {
    if (isAnswered) return
    setSelectedOption(index)
  }

  const handleVerify = () => {
    if (selectedOption === null) return
    setIsAnswered(true)
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setIsFinished(true)
    }
  }

  if (isFinished) {
    return (
      <Card className="p-12 flex flex-col items-center text-center space-y-6">
        <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
          <Trophy className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Quiz Completed!</h2>
          <p className="text-muted-foreground">
            You scored {score} out of {questions.length} on {difficulty} mode.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>Try Another</Button>
          <Button variant="outline" onClick={onExit}>
            Back to Dashboard
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-none bg-transparent">
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="capitalize">{difficulty} Quiz</span>
          <span>
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl leading-snug">{currentQuestion.text}</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswer
          const isSelected = index === selectedOption
          let variant = "outline"

          if (isAnswered) {
            if (isCorrect) variant = "success"
            else if (isSelected) variant = "destructive"
          } else if (isSelected) {
            variant = "primary"
          }

          return (
            <button
              key={index}
              disabled={isAnswered}
              onClick={() => handleSelect(index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                variant === "primary"
                  ? "border-primary bg-primary/5"
                  : variant === "success"
                    ? "border-green-500 bg-green-500/10"
                    : variant === "destructive"
                      ? "border-destructive bg-destructive/10"
                      : "border-muted hover:border-primary/50"
              }`}
            >
              <span className="font-medium">{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
            </button>
          )
        })}
      </CardContent>

      <CardFooter className="p-0 mt-8 flex justify-end">
        {!isAnswered ? (
          <Button size="lg" disabled={selectedOption === null} onClick={handleVerify} className="px-8 rounded-full">
            Check Answer
          </Button>
        ) : (
          <Button size="lg" onClick={handleNext} className="px-8 rounded-full gap-2">
            {currentStep < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
