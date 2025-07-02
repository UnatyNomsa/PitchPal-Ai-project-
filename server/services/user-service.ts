import { eq, and, gte } from 'drizzle-orm'
import { db, users, sessions, type InsertUser, type SelectUser } from '../db.js'
import { SubscriptionTier, SUBSCRIPTION_LIMITS } from '../../shared/types.js'

export class UserService {
  async getUser(userId: string): Promise<SelectUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    
    return result[0] || null
  }

  async createUser(userData: InsertUser): Promise<SelectUser> {
    const result = await db
      .insert(users)
      .values(userData)
      .returning()
    
    return result[0]
  }

  async updateUser(userId: string, updates: Partial<InsertUser>): Promise<SelectUser> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning()
    
    return result[0]
  }

  async canCreateSession(userId: string): Promise<boolean> {
    const user = await this.getUser(userId)
    if (!user) {
      // Create demo user if doesn't exist
      await this.createUser({
        id: userId,
        email: null,
        subscriptionTier: 'free',
        sessionsToday: 0,
      })
      return true
    }

    const limits = SUBSCRIPTION_LIMITS[user.subscriptionTier as SubscriptionTier]
    
    // Check if unlimited sessions
    if (limits.dailySessions === -1) {
      return true
    }

    // Reset daily count if it's a new day
    const today = new Date()
    const lastActive = new Date(user.lastActiveAt)
    
    if (today.toDateString() !== lastActive.toDateString()) {
      await this.resetDailySessionCount(userId)
      return true
    }

    // Check if under daily limit
    return user.sessionsToday < limits.dailySessions
  }

  async incrementSessionCount(userId: string): Promise<void> {
    const user = await this.getUser(userId)
    if (!user) return

    await db
      .update(users)
      .set({
        sessionsToday: user.sessionsToday + 1,
        lastActiveAt: new Date(),
      })
      .where(eq(users.id, userId))
  }

  async resetDailySessionCount(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        sessionsToday: 0,
        lastActiveAt: new Date(),
      })
      .where(eq(users.id, userId))
  }

  async getSessionsCount(userId: string, days: number = 30): Promise<number> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const result = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          gte(sessions.createdAt, startDate)
        )
      )
    
    return result.length
  }

  async upgradeSubscription(userId: string, tier: SubscriptionTier): Promise<SelectUser> {
    return await this.updateUser(userId, {
      subscriptionTier: tier,
    })
  }

  async getSubscriptionInfo(userId: string) {
    const user = await this.getUser(userId)
    if (!user) return null

    const limits = SUBSCRIPTION_LIMITS[user.subscriptionTier as SubscriptionTier]
    const sessionsThisMonth = await this.getSessionsCount(userId, 30)

    return {
      user,
      limits,
      usage: {
        sessionsToday: user.sessionsToday,
        sessionsThisMonth,
      }
    }
  }
}