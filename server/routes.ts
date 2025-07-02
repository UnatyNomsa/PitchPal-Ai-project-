import { Router } from 'express'
import type { Request, Response } from 'express'
import type { Multer } from 'multer'
import { SessionService } from './services/session-service.js'
import { AnalysisService } from './services/analysis-service.js'
import { UserService } from './services/user-service.js'

export function createRoutes(upload: Multer) {
  const router = Router()
  const sessionService = new SessionService()
  const analysisService = new AnalysisService()
  const userService = new UserService()

  // Get all sessions for a user
  router.get('/sessions', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string || 'demo-user'
      const sessions = await sessionService.getUserSessions(userId)
      res.json({ success: true, data: sessions })
    } catch (error) {
      console.error('Error fetching sessions:', error)
      res.status(500).json({ success: false, error: 'Failed to fetch sessions' })
    }
  })

  // Get a specific session
  router.get('/sessions/:id', async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id)
      const session = await sessionService.getSession(sessionId)
      
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' })
      }
      
      res.json({ success: true, data: session })
    } catch (error) {
      console.error('Error fetching session:', error)
      res.status(500).json({ success: false, error: 'Failed to fetch session' })
    }
  })

  // Create a new session
  router.post('/sessions', async (req: Request, res: Response) => {
    try {
      const { title, userId = 'demo-user' } = req.body
      
      // Check subscription limits
      const canCreate = await userService.canCreateSession(userId)
      if (!canCreate) {
        return res.status(429).json({ 
          success: false, 
          error: 'Daily session limit reached. Upgrade to Pro for unlimited sessions.' 
        })
      }
      
      const session = await sessionService.createSession({
        title: title || `Pitch Session ${new Date().toLocaleString()}`,
        userId,
      })
      
      res.status(201).json({ success: true, data: session })
    } catch (error) {
      console.error('Error creating session:', error)
      res.status(500).json({ success: false, error: 'Failed to create session' })
    }
  })

  // Analyze audio for a session
  router.post('/sessions/:id/analyze', upload.single('audio'), async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id)
      const audioFile = req.file
      
      if (!audioFile) {
        return res.status(400).json({ success: false, error: 'No audio file provided' })
      }
      
      console.log(`🎤 Analyzing audio for session ${sessionId}, size: ${audioFile.size} bytes`)
      
      const analysis = await analysisService.analyzeAudio(audioFile.buffer)
      const updatedSession = await sessionService.updateSessionWithAnalysis(sessionId, analysis)
      
      // Increment user's daily session count
      await userService.incrementSessionCount(updatedSession.userId)
      
      res.json({ success: true, data: updatedSession })
    } catch (error) {
      console.error('Error analyzing audio:', error)
      res.status(500).json({ success: false, error: 'Failed to analyze audio' })
    }
  })

  // Direct text analysis (for testing)
  router.post('/analyze-text', async (req: Request, res: Response) => {
    try {
      const { text } = req.body
      
      if (!text) {
        return res.status(400).json({ success: false, error: 'No text provided' })
      }
      
      const analysis = await analysisService.analyzeText(text)
      res.json({ success: true, data: analysis })
    } catch (error) {
      console.error('Error analyzing text:', error)
      res.status(500).json({ success: false, error: 'Failed to analyze text' })
    }
  })

  // Get user subscription info
  router.get('/user/:id/subscription', async (req: Request, res: Response) => {
    try {
      const userId = req.params.id
      const user = await userService.getUser(userId)
      res.json({ success: true, data: user })
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ success: false, error: 'Failed to fetch user info' })
    }
  })

  // Get daily coaching tips
  router.get('/tips', async (req: Request, res: Response) => {
    try {
      const tips = await analysisService.getDailyTips()
      res.json({ success: true, data: tips })
    } catch (error) {
      console.error('Error fetching tips:', error)
      res.status(500).json({ success: false, error: 'Failed to fetch tips' })
    }
  })

  return router
}