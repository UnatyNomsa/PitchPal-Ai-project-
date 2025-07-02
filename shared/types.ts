import { z } from 'zod'

// Session schema
export const SessionSchema = z.object({
  id: z.number(),
  title: z.string(),
  transcript: z.string().nullable(),
  duration: z.number().nullable(),
  overallScore: z.number().nullable(),
  toneScore: z.number().nullable(),
  clarityScore: z.number().nullable(),
  structureScore: z.number().nullable(),
  feedback: z.string().nullable(),
  suggestions: z.array(z.string()).default([]),
  createdAt: z.date(),
  userId: z.string().default('demo-user'),
})

export type Session = z.infer<typeof SessionSchema>

// AI Analysis response
export const AnalysisSchema = z.object({
  transcript: z.string(),
  overallScore: z.number().min(0).max(100),
  toneScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  structureScore: z.number().min(0).max(100),
  feedback: z.string(),
  suggestions: z.array(z.string()),
})

export type Analysis = z.infer<typeof AnalysisSchema>

// User subscription tiers
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  TEAM = 'team',
}

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).default(SubscriptionTier.FREE),
  sessionsToday: z.number().default(0),
  createdAt: z.date(),
  lastActiveAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

// API Response types
export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  [SubscriptionTier.FREE]: {
    dailySessions: 3,
    historyDays: 7,
    features: ['basic_feedback'],
  },
  [SubscriptionTier.PRO]: {
    dailySessions: -1, // unlimited
    historyDays: -1, // unlimited
    features: ['advanced_feedback', 'progress_tracking', 'custom_templates'],
  },
  [SubscriptionTier.TEAM]: {
    dailySessions: -1, // unlimited
    historyDays: -1, // unlimited
    features: ['advanced_feedback', 'progress_tracking', 'custom_templates', 'team_dashboard', 'admin_analytics'],
    maxUsers: 10,
  },
}