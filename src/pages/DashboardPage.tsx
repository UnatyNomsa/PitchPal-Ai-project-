import React from 'react'
import { useLocation } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { Mic, History, TrendingUp, Lightbulb, Plus, Settings } from 'lucide-react'
import { formatDate, calculateAverageScore } from '../lib/utils'

interface Session {
  id: number
  title: string
  overallScore: number | null
  createdAt: string
}

async function fetchSessions(): Promise<Session[]> {
  const response = await fetch('/api/sessions?userId=demo-user')
  const result = await response.json()
  return result.success ? result.data : []
}

async function fetchTips(): Promise<string[]> {
  const response = await fetch('/api/tips')
  const result = await response.json()
  return result.success ? result.data : []
}

export function DashboardPage() {
  const [, setLocation] = useLocation()

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  })

  const { data: tips = [] } = useQuery({
    queryKey: ['tips'],
    queryFn: fetchTips,
  })

  const recentSessions = sessions.slice(0, 3)
  const completedSessions = sessions.filter(s => s.overallScore !== null)
  const averageScore = calculateAverageScore(completedSessions.map(s => s.overallScore!))

  const stats = [
    {
      label: 'Total Sessions',
      value: sessions.length,
      icon: Mic,
      color: 'text-blue-600'
    },
    {
      label: 'Average Score',
      value: completedSessions.length > 0 ? `${averageScore}%` : 'N/A',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'This Month',
      value: sessions.filter(s => {
        const sessionDate = new Date(s.createdAt)
        const now = new Date()
        return sessionDate.getMonth() === now.getMonth() && 
               sessionDate.getFullYear() === now.getFullYear()
      }).length,
      icon: History,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Ready to practice your pitch?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLocation('/pricing')}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Upgrade
              </button>
              <button
                onClick={() => setLocation('/record')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                New Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Sessions</h2>
                <button
                  onClick={() => setLocation('/history')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {sessionsLoading ? (
                <div className="text-center py-8">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setLocation(`/analysis/${session.id}`)}
                    >
                      <div>
                        <h3 className="font-medium">{session.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(session.createdAt))}
                        </p>
                      </div>
                      {session.overallScore !== null && (
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {session.overallScore}%
                          </div>
                          <div className="text-sm text-gray-600">Score</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No sessions yet</p>
                  <button
                    onClick={() => setLocation('/record')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Record Your First Pitch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Daily Tips */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-xl font-semibold">Daily Coaching Tips</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setLocation('/record')}
              className="p-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              <Mic className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Record Pitch</div>
            </button>
            <button
              onClick={() => setLocation('/history')}
              className="p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <History className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">View History</div>
            </button>
            <button
              onClick={() => setLocation('/pricing')}
              className="p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Upgrade Plan</div>
            </button>
            <button
              onClick={() => setLocation('/')}
              className="p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Settings className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">About</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}