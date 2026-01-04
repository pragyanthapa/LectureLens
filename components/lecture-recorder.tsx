"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square } from "lucide-react"

export function LectureRecorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        onRecordingComplete(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("[v0] Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-8 flex flex-col items-center justify-center space-y-6 bg-card border-dashed border-2">
      <div className="relative">
        {isRecording && <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />}
        <div
          className={`p-6 rounded-full ${isRecording ? "bg-destructive" : "bg-primary"} text-white transition-colors duration-300`}
        >
          <Mic className="h-8 w-8" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{isRecording ? "Recording Lecture..." : "Ready to Record"}</h3>
        <p className="text-4xl font-mono font-bold tracking-widest">{formatTime(recordingTime)}</p>
      </div>

      <div className="flex gap-4">
        {!isRecording ? (
          <Button size="lg" onClick={startRecording} className="h-14 px-8 rounded-full text-lg font-semibold">
            Start Session
          </Button>
        ) : (
          <Button
            size="lg"
            variant="destructive"
            onClick={stopRecording}
            className="h-14 px-8 rounded-full text-lg font-semibold"
          >
            <Square className="mr-2 h-5 w-5 fill-current" /> Stop & Process
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Make sure your microphone is positioned clearly towards the speaker.
      </p>
    </Card>
  )
}
