import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import { users, sessions, type InsertUser, type SelectUser, type InsertSession, type SelectSession } from '../shared/db-schema.js'

const sql = neon(process.env.DATABASE_URL || 'postgresql://localhost:5432/pitchpal')
export const db = drizzle(sql)

export async function initDatabase() {
  try {
    console.log('🔄 Initializing database connection...')
    
    // Create demo user if not exists
    await createDemoUser()
    
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

async function createDemoUser() {
  try {
    const existingUser = await db.select().from(users).where(eq(users.id, 'demo-user')).limit(1)
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: 'demo-user',
        email: null,
        subscriptionTier: 'free',
        sessionsToday: 0,
      })
      console.log('✅ Demo user created')
    }
  } catch (error) {
    console.log('ℹ️  Demo user already exists or error creating:', error.message)
  }
}

export { users, sessions }
export type { InsertUser, SelectUser, InsertSession, SelectSession }