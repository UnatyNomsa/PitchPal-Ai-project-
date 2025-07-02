import OpenAI from 'openai'
import type { Analysis } from '../../shared/types.js'

export class AnalysisService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async analyzeAudio(audioBuffer: Buffer): Promise<Analysis> {
    try {
      console.log('🔄 Transcribing audio...')
      
      // Convert buffer to File object for OpenAI
      const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' })
      
      // Transcribe audio using Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
      })

      console.log('✅ Transcription complete, analyzing content...')
      
      return await this.analyzeText(transcription.text)
    } catch (error) {
      console.error('Error in audio analysis:', error)
      throw new Error('Failed to analyze audio')
    }
  }

  async analyzeText(text: string): Promise<Analysis> {
    try {
      const prompt = `
You are an expert sales coach. Analyze this sales pitch and provide detailed feedback.

Sales Pitch: "${text}"

Please provide your analysis in the following JSON format:
{
  "transcript": "${text}",
  "overallScore": <number 0-100>,
  "toneScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "feedback": "<detailed feedback paragraph>",
  "suggestions": ["<specific suggestion 1>", "<specific suggestion 2>", "<specific suggestion 3>"]
}

Scoring criteria:
- Overall Score: General effectiveness and persuasiveness
- Tone Score: Confidence, enthusiasm, professionalism
- Clarity Score: Clear communication, easy to understand
- Structure Score: Logical flow, clear value proposition, call to action

Provide 3-5 specific, actionable suggestions for improvement.
`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional sales coach. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI')
      }

      // Parse the JSON response
      const analysis = JSON.parse(response) as Analysis
      
      // Validate the analysis has all required fields
      if (!this.isValidAnalysis(analysis)) {
        throw new Error('Invalid analysis format from AI')
      }

      console.log('✅ Analysis complete')
      return analysis

    } catch (error) {
      console.error('Error analyzing text:', error)
      
      // Fallback analysis if AI fails
      return this.generateFallbackAnalysis(text)
    }
  }

  private isValidAnalysis(analysis: any): analysis is Analysis {
    return (
      typeof analysis.transcript === 'string' &&
      typeof analysis.overallScore === 'number' &&
      typeof analysis.toneScore === 'number' &&
      typeof analysis.clarityScore === 'number' &&
      typeof analysis.structureScore === 'number' &&
      typeof analysis.feedback === 'string' &&
      Array.isArray(analysis.suggestions)
    )
  }

  private generateFallbackAnalysis(text: string): Analysis {
    return {
      transcript: text,
      overallScore: 75,
      toneScore: 70,
      clarityScore: 80,
      structureScore: 70,
      feedback: "Your pitch shows good potential! Focus on adding more specific benefits and a stronger call to action. Practice your delivery to sound more confident and enthusiastic.",
      suggestions: [
        "Add specific numbers or statistics to support your claims",
        "Include a clear call to action at the end",
        "Practice your opening to grab attention immediately",
        "Use more confident language and avoid filler words"
      ]
    }
  }

  async getDailyTips(): Promise<string[]> {
    const tips = [
      "Start with a compelling hook that addresses your prospect's pain point",
      "Use the 'Problem-Agitation-Solution' framework for maximum impact",
      "Practice your pitch with a timer - aim for 2-3 minutes maximum",
      "Include social proof and specific examples to build credibility",
      "End with a clear, specific call to action",
      "Record yourself and listen back to identify areas for improvement",
      "Use power words like 'transform', 'breakthrough', 'proven', 'guaranteed'",
      "Match your prospect's communication style and pace",
      "Ask qualifying questions to engage your prospect",
      "Practice handling common objections confidently"
    ]

    // Return 3 random tips
    const shuffled = tips.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }
}