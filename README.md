# PitchPal AI

**PITCH SMARTER. WIN FASTER.**

A voice-based AI coaching application that analyzes sales pitches and provides instant feedback on tone, clarity, and structure to help sales professionals improve their performance.

![PitchPal AI Logo](./attached_assets/PitchPal%20Ai_1751406067908.png)

## Features

- 🎤 **Real-time Voice Recording** - Record sales pitches with professional audio visualization
- 🤖 **AI-Powered Analysis** - Get instant feedback using OpenAI's GPT-4o and Whisper models
- 📊 **Performance Scoring** - Detailed scores for tone, clarity, and structure (0-100 scale)
- 💡 **Actionable Insights** - Specific suggestions for improvement with coaching tips
- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive interface
- 💾 **Session History** - Track progress over time with persistent database storage
- ⚡ **Fast Analysis** - Quick transcription and feedback generation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **Web Audio API** for voice recording and visualization

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** with PostgreSQL
- **OpenAI API** (GPT-4o + Whisper)
- **Multer** for file uploads

### Database
- **PostgreSQL** with connection pooling
- **Drizzle Kit** for schema management
- **Zod** for type validation

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/pitchpal-ai.git
cd pitchpal-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Add to your environment or .env file
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

1. **Welcome Screen** - Introduction to PitchPal AI with feature overview
2. **Dashboard** - View practice sessions, progress stats, and daily tips
3. **Recording** - Record your sales pitch with real-time audio visualization
4. **Analysis** - Get detailed AI feedback with scores and improvement suggestions
5. **History** - Review past sessions and track your progress over time

## API Endpoints

- `GET /api/sessions` - Retrieve user practice sessions
- `POST /api/sessions` - Create a new practice session
- `GET /api/sessions/:id` - Get specific session details
- `POST /api/sessions/:id/analyze` - Upload audio and get AI analysis
- `POST /api/analyze-text` - Analyze text directly (for testing)

## Deployment

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `NODE_ENV` - Set to 'production' for production builds

### Recommended Platforms

- **Replit** - Direct deployment with built-in database
- **Vercel** - Frontend deployment with serverless functions
- **Railway** - Full-stack deployment with PostgreSQL
- **Heroku** - Traditional deployment option

## Pricing Model

### Free Tier
- 3 sessions per day
- Basic feedback analysis
- 7-day history

### Pro ($9.99/month)
- Unlimited daily sessions
- Advanced AI feedback
- Unlimited history
- Progress tracking
- Custom pitch templates

### Team ($49.99/month)
- Everything in Pro
- Up to 10 users
- Team dashboard
- Group training modules
- Admin analytics

## Development

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── services/          # Business logic services
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database abstraction layer
│   └── db.ts              # Database connection
├── shared/                # Shared types and schemas
└── attached_assets/       # Static assets and logos
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@pitchpal.ai or open an issue on GitHub.

## Acknowledgments

- OpenAI for GPT-4o and Whisper AI models
- shadcn/ui for the component library
- Drizzle ORM for the database toolkit
- Replit for the development platform

---

**Made with ❤️ for sales professionals worldwide**