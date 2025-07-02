#!/usr/bin/env node

// Test script to verify your setup
import { config } from 'dotenv'
import OpenAI from 'openai'
import { neon } from '@neondatabase/serverless'

config() // Load .env file

console.log('🧪 Testing PitchPal AI Setup...\n')

// Test 1: Check environment variables
console.log('1️⃣ Checking environment variables...')
const dbUrl = process.env.DATABASE_URL
const openaiKey = process.env.OPENAI_API_KEY

if (!dbUrl || dbUrl.includes('your-') || dbUrl.includes('host.neon.tech')) {
  console.log('❌ DATABASE_URL not configured')
  console.log('   Please update DATABASE_URL in .env file')
} else {
  console.log('✅ DATABASE_URL found')
}

if (!openaiKey || openaiKey.includes('your-') || openaiKey === 'sk-your-openai-key-here') {
  console.log('❌ OPENAI_API_KEY not configured')
  console.log('   Please update OPENAI_API_KEY in .env file')
} else {
  console.log('✅ OPENAI_API_KEY found')
}

if (!dbUrl || !openaiKey || dbUrl.includes('your-') || openaiKey.includes('your-')) {
  console.log('\n❌ Please update your .env file with real credentials first!')
  console.log('\n📋 Next steps:')
  console.log('1. Get OpenAI API key from: https://platform.openai.com')
  console.log('2. Get Database URL from: https://neon.tech')
  console.log('3. Update .env file with real values')
  console.log('4. Run: node test-setup.js')
  process.exit(1)
}

// Test 2: Database connection
console.log('\n2️⃣ Testing database connection...')
try {
  const sql = neon(dbUrl)
  const result = await sql`SELECT NOW() as current_time`
  console.log('✅ Database connected successfully!')
  console.log(`   Server time: ${result[0].current_time}`)
} catch (error) {
  console.log('❌ Database connection failed:')
  console.log(`   ${error.message}`)
  console.log('\n💡 Troubleshooting:')
  console.log('   - Check your DATABASE_URL is correct')
  console.log('   - Make sure the database exists')
  console.log('   - Verify network connection')
}

// Test 3: OpenAI API
console.log('\n3️⃣ Testing OpenAI API...')
try {
  const openai = new OpenAI({ apiKey: openaiKey })
  
  // Test with a simple completion
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Using cheaper model for testing
    messages: [{ role: 'user', content: 'Say "API test successful"' }],
    max_tokens: 10
  })
  
  const response = completion.choices[0]?.message?.content
  console.log('✅ OpenAI API connected successfully!')
  console.log(`   Response: ${response}`)
} catch (error) {
  console.log('❌ OpenAI API connection failed:')
  console.log(`   ${error.message}`)
  console.log('\n💡 Troubleshooting:')
  console.log('   - Check your OPENAI_API_KEY is correct')
  console.log('   - Ensure you have credits/payment method')
  console.log('   - Verify API key has proper permissions')
}

console.log('\n🎉 Setup test complete!')
console.log('\nIf all tests pass, run: npm run dev')