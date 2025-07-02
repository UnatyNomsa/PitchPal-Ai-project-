import React from 'react'
import { useLocation, useParams } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, Lightbulb, Star, RefreshCw } from 'lucide-react'
import { formatDate, getScoreColorClass } from '../lib/utils'

interface SessionData {
  id: number
  title: string
  transcript: string | null
  duration: number | null
  overallScore: number | null
  toneScore: number | null
  clarityScore: number | null
  structureScore: number | null
  feedback: string | null
  suggestions: string[]
  createdAt: string
}

async function fetchSession(sessionId: string): Promise<SessionData> {
  const response = await fetch(`/api/sessions/${sessionId}`)
  const result = await response.json()
  if (!result.success) throw new Error(result.error)
  return result.data
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`score-circle ${getScoreColorClass(score)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${getScoreColorClass(score)}`}>
            {score}%
          </span>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-900">{label}</div>
    </div>
  )
}

export function AnalysisPage() {
  const [, setLocation] = useLocation()
  const { sessionId } = useParams()

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: !!sessionId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Found</h2>
          <p className="text-gray-600 mb-6">
            This session doesn't exist or hasn't been analyzed yet.
          </p>
          <button
            onClick={() => setLocation('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const hasAnalysis = session.overallScore !== null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setLocation('/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
                <p className="text-gray-600">
                  Recorded on {formatDate(new Date(session.createdAt))}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLocation('/record')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Recording
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!hasAnalysis ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Analysis Pending
            </h2>
            <p className="text-gray-600 mb-6">
              This session hasn't been analyzed yet. Record your pitch to get instant AI feedback.
            </p>
            <button
              onClick={() => setLocation('/record')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Record Pitch
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overall Score */}
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Overall Performance
              </h2>
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 - (session.overallScore! / 100) * 2 * Math.PI * 45}
                      className={`score-circle ${getScoreColorClass(session.overallScore!)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColorClass(session.overallScore!)}`}>
                      {session.overallScore}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <ScoreCircle score={session.toneScore!} label="Tone" />
                <ScoreCircle score={session.clarityScore!} label="Clarity" />
                <ScoreCircle score={session.structureScore!} label="Structure" />
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Detailed Feedback
                </h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {session.feedback}
                </p>
              </div>
            </div>

            {/* Suggestions */}
            {session.suggestions && session.suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center mb-6">
                  <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Improvement Suggestions
                  </h2>
                </div>
                <div className="space-y-4">
                  {session.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <Star className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript */}
            {session.transcript && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Transcript
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {session.transcript}
                  </p>
                </div>
                {session.duration && (
                  <div className="mt-4 text-sm text-gray-600">
                    Duration: {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                Keep Improving
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Practice More</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    Regular practice is key to improving your pitch delivery.
                  </p>
                  <button
                    onClick={() => setLocation('/record')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Record Another Pitch
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Track Progress</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    Review your past sessions to see how you're improving.
                  </p>
                  <button
                    onClick={() => setLocation('/history')}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}