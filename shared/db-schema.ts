import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer,
  varchar,
  json,
  pgEnum
} from 'drizzle-orm/pg-core'

// Enums
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'pro', 'team'])

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }),
  subscriptionTier: subscriptionTierEnum('subscription_tier').default('free').notNull(),
  sessionsToday: integer('sessions_today').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
})

// Sessions table
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).default('demo-user').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  transcript: text('transcript'),
  duration: integer('duration'), // in seconds
  overallScore: integer('overall_score'),
  toneScore: integer('tone_score'),
  clarityScore: integer('clarity_score'),
  structureScore: integer('structure_score'),
  feedback: text('feedback'),
  suggestions: json('suggestions').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertSession = typeof sessions.$inferInsert
export type SelectSession = typeof sessions.$inferSelect