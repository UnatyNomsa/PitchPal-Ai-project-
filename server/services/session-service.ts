import { eq, desc } from 'drizzle-orm'
import { db, sessions, type InsertSession, type SelectSession } from '../db.js'
import type { Analysis } from '../../shared/types.js'

export class SessionService {
  async getUserSessions(userId: string): Promise<SelectSession[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.createdAt))
  }

  async getSession(sessionId: number): Promise<SelectSession | null> {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1)
    
    return result[0] || null
  }

  async createSession(data: Omit<InsertSession, 'id' | 'createdAt'>): Promise<SelectSession> {
    const result = await db
      .insert(sessions)
      .values({
        ...data,
        suggestions: data.suggestions || [],
      })
      .returning()
    
    return result[0]
  }

  async updateSessionWithAnalysis(sessionId: number, analysis: Analysis): Promise<SelectSession> {
    const result = await db
      .update(sessions)
      .set({
        transcript: analysis.transcript,
        overallScore: analysis.overallScore,
        toneScore: analysis.toneScore,
        clarityScore: analysis.clarityScore,
        structureScore: analysis.structureScore,
        feedback: analysis.feedback,
        suggestions: analysis.suggestions,
        duration: this.estimateDuration(analysis.transcript),
      })
      .where(eq(sessions.id, sessionId))
      .returning()
    
    return result[0]
  }

  private estimateDuration(transcript: string): number {
    // Estimate duration based on transcript length
    // Average speaking rate is ~150 words per minute
    const words = transcript.split(' ').length
    const estimatedMinutes = words / 150
    return Math.round(estimatedMinutes * 60) // Return seconds
  }

  async deleteSession(sessionId: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  }

  async getSessionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<SelectSession[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.createdAt))
  }
}