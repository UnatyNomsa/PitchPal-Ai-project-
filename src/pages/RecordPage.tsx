import React, { useState } from 'react'
import { useLocation } from 'wouter'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload } from 'lucide-react'
import { AudioRecorder } from '../components/AudioRecorder'

interface CreateSessionResponse {
  id: number
  title: string
}

async function createSession(): Promise<CreateSessionResponse> {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'demo-user' }),
  })
  const result = await response.json()
  if (!result.success) throw new Error(result.error)
  return result.data
}

async function analyzeAudio(sessionId: number, audioBlob: Blob): Promise<any> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  
  const response = await fetch(`/api/sessions/${sessionId}/analyze`, {
    method: 'POST',
    body: formData,
  })
  const result = await response.json()
  if (!result.success) throw new Error(result.error)
  return result.data
}

export function RecordPage() {
  const [, setLocation] = useLocation()
  const [currentSession, setCurrentSession] = useState<CreateSessionResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const queryClient = useQueryClient()

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      setCurrentSession(session)
    },
    onError: (error) => {
      console.error('Failed to create session:', error)
      alert('Failed to create session. Please try again.')
    },
  })

  const handleRecordingStart = () => {
    if (!currentSession) {
      createSessionMutation.mutate()
    }
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!currentSession) {
      console.error('No session created')
      return
    }

    setIsAnalyzing(true)
    
    try {
      await analyzeAudio(currentSession.id, audioBlob)
      
      // Invalidate sessions query to refresh data
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      
      // Navigate to analysis page
      setLocation(`/analysis/${currentSession.id}`)
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
      alert('Analysis failed. Please try again.')
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing Your Pitch
            </h2>
            <p className="text-gray-600">
              Our AI is processing your recording and generating feedback...
            </p>
          </div>
          
          <div className="loading-dots justify-center mb-6">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <div>✓ Transcribing audio with Whisper AI</div>
            <div>✓ Analyzing tone and clarity</div>
            <div>✓ Evaluating structure and flow</div>
            <div>⏳ Generating personalized feedback</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={() => setLocation('/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Recording</h1>
              <p className="text-gray-600">Practice your sales pitch and get instant AI feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {currentSession && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-1">Session Created</h3>
              <p className="text-blue-800 text-sm">
                {currentSession.title} - Ready to record your pitch
              </p>
            </div>
          )}

          <AudioRecorder
            onRecordingStart={handleRecordingStart}
            onRecordingComplete={handleRecordingComplete}
          />

          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Make the Most of Your Recording
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Before Recording:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prepare your key talking points</li>
                  <li>• Practice your opening hook</li>
                  <li>• Know your value proposition</li>
                  <li>• Plan your call to action</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">During Recording:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Speak with confidence and energy</li>
                  <li>• Maintain a steady pace</li>
                  <li>• Use clear, simple language</li>
                  <li>• Show genuine enthusiasm</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sample Pitch Structure */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Effective Pitch Structure
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Hook & Introduction</h4>
                  <p className="text-sm text-gray-600">Grab attention with a compelling opening</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Problem Identification</h4>
                  <p className="text-sm text-gray-600">Clearly articulate the customer's pain point</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Solution Presentation</h4>
                  <p className="text-sm text-gray-600">Present your product/service as the solution</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Benefits & Value</h4>
                  <p className="text-sm text-gray-600">Highlight key benefits and ROI</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  5
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Call to Action</h4>
                  <p className="text-sm text-gray-600">End with a clear next step</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}