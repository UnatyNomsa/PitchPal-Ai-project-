# PitchPal AI - Sales Coaching Application

## Overview

PitchPal AI is a modern web application that provides AI-powered feedback for sales pitches. Users can record their pitches, receive real-time analysis, and get actionable coaching tips to improve their sales performance. The application combines speech recognition, AI analysis, and an intuitive mobile-first interface to deliver a comprehensive sales training experience.

## System Architecture

The application follows a full-stack TypeScript architecture with clear separation between client and server concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Audio Processing**: Web Audio API with custom AudioRecorder class

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **File Processing**: Multer for audio file uploads (10MB limit)
- **Development**: Hot reload with Vite middleware integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Strongly typed with Zod validation
- **Provider**: PostgreSQL database with connection pooling
- **Migrations**: Drizzle Kit for schema management
- **Storage Strategy**: PostgreSQL database for persistent data storage

## Key Components

### Audio Recording System
- **AudioRecorder Class**: Handles MediaRecorder API with optimized settings
- **AudioVisualizer**: Real-time frequency domain visualization
- **Speech Recognition Hook**: Custom React hook managing recording lifecycle
- **Format Support**: WebM with Opus codec for optimal compression

### AI Integration
- **OpenAI GPT-4o**: Latest model for pitch analysis
- **Analysis Metrics**: Overall score, tone, clarity, and structure scoring (0-100 scale)
- **Feedback Generation**: Structured insights and actionable suggestions
- **Transcription**: Audio-to-text processing for pitch content analysis

### Session Management
- **User Sessions**: Persistent storage of pitch recordings and analysis
- **Default User**: Demo user system for simplified onboarding
- **Session History**: Chronological tracking with performance metrics
- **Duration Tracking**: Precise timing for pace calculation

### UI Component System
- **Design System**: shadcn/ui with consistent styling patterns
- **Mobile-First**: Responsive design optimized for mobile devices
- **Component Library**: Comprehensive set of reusable UI components
- **Theming**: CSS custom properties with light/dark mode support

## Data Flow

1. **Recording Phase**: User initiates recording through AudioVisualizer interface
2. **Audio Capture**: Web Audio API captures microphone input with noise suppression
3. **Session Creation**: Backend creates pitch session with generated title
4. **File Upload**: Audio blob uploaded via multipart form data
5. **AI Processing**: OpenAI analyzes transcript and generates structured feedback
6. **Data Persistence**: Session data stored with feedback metrics
7. **Results Display**: Formatted feedback presented with score visualization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **openai**: Official OpenAI API client for GPT-4o integration
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI primitives for accessibility

### Development Tools
- **drizzle-kit**: Database schema management and migrations
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

### Audio Processing
- **multer**: File upload middleware with memory storage
- **Web Audio API**: Browser-native audio processing
- **MediaRecorder API**: Audio recording with configurable codecs

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express middleware
- **Hot Reload**: Real-time code updates for both client and server
- **Error Handling**: Runtime error overlay for debugging
- **Database**: In-memory storage for rapid development iteration

### Production Build
- **Client Build**: Vite optimized bundle with code splitting
- **Server Build**: esbuild compilation to ESM format
- **Static Assets**: Served from dist/public directory
- **Database**: PostgreSQL with connection pooling via Neon

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **OpenAI API Key**: Required for AI analysis functionality
- **Node Environment**: Development/production mode switching

## Recent Changes

- July 01, 2025. Database integration completed - PostgreSQL database now stores all user sessions and pitch data persistently
- July 01, 2025. Logo integration - Added custom PitchPal AI branding to welcome screen
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.