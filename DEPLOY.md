# PitchPal AI Deployment Guide

## Quick Start (Development)

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd pitchpal-ai
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database and OpenAI API key
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## Production Deployment

### Recommended Platforms

#### 1. Replit (Easiest)
- Fork the repository on Replit
- Set environment variables in Replit Secrets
- Deploy with one click

#### 2. Vercel + Neon Database
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
```

#### 3. Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway add
railway deploy
```

#### 4. Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for GPT-4o and Whisper

### Optional
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Features Included

### ✅ Core Features
- Voice recording with real-time visualization
- AI-powered speech analysis using GPT-4o and Whisper
- Detailed scoring for tone, clarity, and structure
- Session history and progress tracking
- Responsive mobile-first design

### ✅ Monetization
- Freemium model (3 sessions/day free)
- Pro plan ($9.99/month) - unlimited sessions
- Team plan ($49.99/month) - up to 10 users
- Subscription limits enforcement

### ✅ Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI GPT-4o + Whisper
- **Audio**: Web Audio API + MediaRecorder

### ✅ Pages & Components
- Welcome/Landing page with testimonials
- Dashboard with session overview
- Recording page with audio visualizer
- Analysis results with detailed feedback
- Session history with filtering
- Pricing page with subscription tiers

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo and brand name
- Modify copy in welcome page

### AI Prompts
- Edit analysis prompts in `server/services/analysis-service.ts`
- Customize scoring criteria
- Add domain-specific feedback

### Subscription Plans
- Modify plans in `shared/types.ts` (SUBSCRIPTION_LIMITS)
- Update pricing in `src/pages/PricingPage.tsx`
- Integrate with Stripe for payments

## Troubleshooting

### Audio Recording Issues
- Ensure HTTPS in production (required for microphone access)
- Check browser permissions
- Test with different audio formats

### Database Connection
- Verify DATABASE_URL format
- Ensure database exists
- Run `npm run db:push` to create tables

### OpenAI API
- Check API key validity
- Monitor usage limits
- Handle rate limiting in production

## Support

For technical support or custom development:
- Email: support@pitchpal.ai
- Documentation: Check README.md
- Issues: Create GitHub issue

---

**Built with ❤️ for sales professionals worldwide**