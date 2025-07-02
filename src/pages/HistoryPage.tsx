import React, { useState } from 'react'
import { useLocation } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, Calendar, Filter, Search } from 'lucide-react'
import { formatDate, getScoreColorClass, calculateAverageScore } from '../lib/utils'

interface Session {
  id: number
  title: string
  overallScore: number | null
  toneScore: number | null
  clarityScore: number | null
  structureScore: number | null
  createdAt: string
  duration: number | null
}

async function fetchSessions(): Promise<Session[]> {
  const response = await fetch('/api/sessions?userId=demo-user')
  const result = await response.json()
  return result.success ? result.data : []
}

export function HistoryPage() {
  const [, setLocation] = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  })

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (filterScore === 'all' || !session.overallScore) return true
    
    switch (filterScore) {
      case 'high':
        return session.overallScore >= 80
      case 'medium':
        return session.overallScore >= 60 && session.overallScore < 80
      case 'low':
        return session.overallScore < 60
      default:
        return true
    }
  })

  const completedSessions = sessions.filter(s => s.overallScore !== null)
  const averageScore = calculateAverageScore(completedSessions.map(s => s.overallScore!))
  
  // Calculate progress over time
  const recentSessions = completedSessions.slice(0, 5)
  const olderSessions = completedSessions.slice(5, 10)
  const recentAverage = calculateAverageScore(recentSessions.map(s => s.overallScore!))
  const olderAverage = calculateAverageScore(olderSessions.map(s => s.overallScore!))
  const improvement = olderSessions.length > 0 ? recentAverage - olderAverage : 0

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
                <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
                <p className="text-gray-600">Track your progress over time</p>
              </div>
            </div>
            <button
              onClick={() => setLocation('/record')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Recording
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{sessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColorClass(averageScore)}`}>
                  {completedSessions.length > 0 ? `${averageScore}%` : 'N/A'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completedSessions.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Improvement</p>
                <p className={`text-3xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {improvement > 0 ? '+' : ''}{improvement.toFixed(0)}%
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Scores</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (60-79%)</option>
                <option value="low">Low (<60%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              All Sessions ({filteredSessions.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="loading-dots justify-center">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : filteredSessions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setLocation(`/analysis/${session.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatDate(new Date(session.createdAt))}
                        {session.duration && (
                          <span className="ml-2">
                            • {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </p>
                      
                      {session.overallScore !== null && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Overall:</span>
                            <span className={`font-semibold ${getScoreColorClass(session.overallScore)}`}>
                              {session.overallScore}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Tone:</span>
                            <span className={`font-semibold ${getScoreColorClass(session.toneScore!)}`}>
                              {session.toneScore}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Clarity:</span>
                            <span className={`font-semibold ${getScoreColorClass(session.clarityScore!)}`}>
                              {session.clarityScore}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Structure:</span>
                            <span className={`font-semibold ${getScoreColorClass(session.structureScore!)}`}>
                              {session.structureScore}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {session.overallScore !== null && (
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${getScoreColorClass(session.overallScore)}`}>
                          {session.overallScore}%
                        </div>
                        <div className="text-sm text-gray-600">Overall</div>
                      </div>
                    )}
                    
                    {session.overallScore === null && (
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                          Not analyzed
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {searchTerm || filterScore !== 'all' 
                  ? 'No sessions match your filters' 
                  : 'No sessions yet'
                }
              </p>
              {!searchTerm && filterScore === 'all' && (
                <button
                  onClick={() => setLocation('/record')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Record Your First Pitch
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}