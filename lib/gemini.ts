import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

console.log("Gemini Service Initializing...")
console.log("API Key present:", !!apiKey)

if (!apiKey) console.error("NEXT_PUBLIC_GEMINI_API_KEY is missing from environment variables")

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const runWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 2000): Promise<any> => {
  try {
    return await fn()
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes("429") || error.status === 429)) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return runWithRetry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

// Convert audio blob to base64
export const audioBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      // Remove data URL prefix
      const base64 = base64String.split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Convert audio blob to a format supported by Gemini
const convertAudioForGemini = async (blob: Blob): Promise<{ base64: string; mimeType: string }> => {
  const base64 = await audioBlobToBase64(blob)

  // Determine mime type based on blob type
  let mimeType = "audio/webm" // default

  if (blob.type) {
    const blobType = blob.type.toLowerCase()
    if (blobType.includes("webm")) {
      mimeType = "audio/webm"
    } else if (blobType.includes("mp3") || blobType.includes("mpeg")) {
      mimeType = "audio/mpeg"
    } else if (blobType.includes("wav")) {
      mimeType = "audio/wav"
    } else if (blobType.includes("ogg")) {
      mimeType = "audio/ogg"
    } else if (blobType.includes("aac") || blobType.includes("m4a")) {
      mimeType = "audio/aac"
    } else {
      // Try webm as fallback
      mimeType = "audio/webm"
    }
  }

  return { base64, mimeType }
}

// Transcribe audio using Gemini
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!genAI) throw new Error("Gemini API key not found in environment variables.")

  // Validate audio size (Gemini has limits)
  if (audioBlob.size > 20 * 1024 * 1024) {
    // 20MB limit
    throw new Error("Audio file is too large. Please record a shorter lecture (max 20MB).")
  }

  if (audioBlob.size === 0) {
    throw new Error("Audio file is empty. Please record again.")
  }

  const { base64: base64Audio, mimeType } = await convertAudioForGemini(audioBlob)

  console.log("Transcribing audio:", {
    mimeType,
    size: `${(audioBlob.size / 1024).toFixed(2)} KB`,
    blobType: audioBlob.type,
  })

  return runWithRetry(async () => {
    const model = genAI!.getGenerativeModel({ model: "gemini-flash-latest" })

    // Try with audio input
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: mimeType,
        },
      },
      {
        text: "Transcribe this audio lecture word-for-word. Provide a complete, accurate transcription of everything that was said. Include all details, concepts, and explanations.",
      },
    ])

    const response = await result.response
    const transcription = response.text()

    if (!transcription || transcription.trim().length === 0) {
      throw new Error("Received empty transcription. The audio might be too quiet or unclear.")
    }

    return transcription
  })
}

// Generate explanation/summary from transcription
export const generateSummary = async (transcript: string): Promise<string> => {
  if (!genAI) throw new Error("Gemini API key not found in environment variables.")

  return runWithRetry(async () => {
    const model = genAI!.getGenerativeModel({ model: "gemini-flash-latest" })

    const prompt = `You are an expert educational assistant. Based on the following lecture transcription, provide a concise, precise summary in plain text format.

Transcription:
${transcript}

Instructions:
- Keep the response brief and focused (aim for 200-400 words total)
- Provide only the most important concepts and key points
- Use clear, direct language - avoid unnecessary elaboration
- Use plain text only - NO markdown formatting (no ###, ####, **, or any markdown symbols)
- Use simple line breaks and bullet points with dashes (-) only
- Include only essential definitions and terms
- Skip redundant explanations

Format:
1. Brief title (one line, no formatting)
2. Key concepts (2-3 bullet points max per concept, use dashes)
3. Important terms (brief definitions only)
4. Main takeaway (1-2 sentences)

Be precise and concise. Do not add filler content. Use plain text only - no markdown symbols.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Remove markdown formatting
    // Order matters: remove ** before single * to avoid conflicts
    text = text
      .replace(/###+\s*/g, '') // Remove ### and #### headings
      .replace(/####+\s*/g, '') // Remove #### and more
      .replace(/\*\*/g, '') // Remove ** bold markers
      .replace(/\*/g, '') // Remove single * italic markers
      .replace(/`/g, '') // Remove code backticks
      .replace(/#{1,6}\s+/g, '') // Remove any remaining heading markers (# through ######)
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
      .trim()
    
    return text
  })
}

// Generate quiz questions based on transcription
export const generateQuiz = async (
  transcript: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
  numQuestions: number = 3
): Promise<Array<{ question: string; options: string[]; correctAnswer: number }>> => {
  if (!genAI) throw new Error("Gemini API key not found in environment variables.")

  return runWithRetry(async () => {
    const model = genAI!.getGenerativeModel({ model: "gemini-flash-latest" })

    const difficultyDescription = {
      easy: "foundational facts and basic concepts",
      medium: "application and understanding of concepts",
      hard: "deep theoretical knowledge and complex analysis",
    }

    const prompt = `You are an expert teacher. Create a quiz based strictly on the following transcript.

Transcript:
"${transcript}"

Difficulty Level: ${difficulty} (${difficultyDescription[difficulty]})

Instructions:
1. Generate ${numQuestions} multiple-choice questions.
2. Each question must be directly answerable from the transcript.
3. Provide 4 options for each question.
4. Indicate the correct answer index (0-3).
5. Output valid JSON ONLY. Do not add any markdown formatting or explanations.

JSON Schema:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("Raw Gemini Quiz Response:", text)

    try {
      // Robust JSON extraction
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      const jsonStr = jsonMatch ? jsonMatch[0] : text
      return JSON.parse(jsonStr)
    } catch (e) {
      console.error("Failed to parse quiz JSON:", e)
      return []
    }
  })
}

// Process audio: transcribe and generate explanation
export const processLectureAudio = async (audioBlob: Blob): Promise<{ transcription: string; explanation: string }> => {
  try {
    // First, transcribe the audio
    const transcription = await transcribeAudio(audioBlob)

    // Then, generate explanation from transcription
    const explanation = await generateSummary(transcription)

    return { transcription, explanation }
  } catch (error) {
    console.error("Error processing lecture audio:", error)
    throw error
  }
}

// Generate explanation from transcription (alias for generateSummary)
export const generateExplanation = generateSummary

// Generate quiz questions (updated to match new signature)
export const generateQuizQuestions = async (
  transcription: string,
  difficulty: "easy" | "medium" | "hard",
  numQuestions: number = 3
): Promise<Array<{ text: string; options: string[]; correctAnswer: number }>> => {
  const quiz = await generateQuiz(transcription, difficulty, numQuestions)
  // Transform to match expected format
  return quiz.map((q) => ({
    text: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
  }))
}
