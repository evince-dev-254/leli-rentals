# AI Integration Guide for Leli Rentals

This guide explains how to connect the Leli Rentals AI chat system to real AI services for production use.

## Overview

The current AI chat system uses a mock service with predefined responses. To make it production-ready, you need to integrate with a real AI service like OpenAI, Anthropic Claude, or Google Gemini.

## Supported AI Services

### 1. OpenAI GPT Integration

#### Setup
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to your `.env.local`:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

#### Implementation
```typescript
// lib/ai-service-example.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function generateAIResponse(userMessage: string, context: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Leli, an AI assistant for Leli Rentals. Help users with booking, listing, and account management."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('AI service unavailable');
  }
}
```

#### Cost Estimate
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Average conversation: ~$0.01-0.05
- Monthly cost for 1000 users: ~$50-200

### 2. Anthropic Claude Integration

#### Setup
1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Add to your `.env.local`:
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### Implementation
```typescript
export async function generateClaudeResponse(userMessage: string, context: any) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `You are Leli, an AI assistant for Leli Rentals. Help users with booking, listing, and account management. User message: ${userMessage}`
          }
        ]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('AI service unavailable');
  }
}
```

#### Cost Estimate
- Claude 3 Sonnet: ~$0.003 per 1K tokens
- Average conversation: ~$0.02-0.08
- Monthly cost for 1000 users: ~$80-300

### 3. Google Gemini Integration

#### Setup
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
```

#### Implementation
```typescript
export async function generateGeminiResponse(userMessage: string, context: any) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Leli, an AI assistant for Leli Rentals. Help users with booking, listing, and account management. User message: ${userMessage}`
          }]
        }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI service unavailable');
  }
}
```

#### Cost Estimate
- Gemini Pro: Free tier available, then ~$0.001 per 1K tokens
- Average conversation: ~$0.005-0.02
- Monthly cost for 1000 users: ~$20-80

## Integration Steps

### 1. Update the AI Service

Replace the mock implementation in `lib/professional-ai-chat-service.ts`:

```typescript
// Replace the generateResponse method
async generateResponse(
  userMessage: string,
  session: ChatSession,
  context?: any
): Promise<AIResponse> {
  try {
    // Call your chosen AI service
    const aiResponse = await generateAIResponse(userMessage, context);
    
    return {
      message: aiResponse,
      confidence: 0.9,
      category: 'ai_response',
      suggestedActions: this.getSuggestedActionsForIntent('general'),
      quickReplies: this.getQuickRepliesForIntent('general'),
      shouldEscalate: false
    };
  } catch (error) {
    // Fallback to FAQ database
    return this.generateFallbackResponse(userMessage);
  }
}
```

### 2. Add Rate Limiting

```typescript
// lib/rate-limiter.ts
const rateLimits = new Map();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(userId) || { count: 0, resetTime: now + 60000 };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + 60000;
  }
  
  if (userLimit.count >= 10) { // 10 requests per minute
    return false;
  }
  
  userLimit.count++;
  rateLimits.set(userId, userLimit);
  return true;
}
```

### 3. Add Caching

```typescript
// lib/ai-cache.ts
const cache = new Map();

export function getCachedResponse(message: string): string | null {
  return cache.get(message.toLowerCase());
}

export function setCachedResponse(message: string, response: string): void {
  cache.set(message.toLowerCase(), response);
}
```

## Best Practices

### 1. Error Handling
- Always have fallback responses
- Implement retry logic for network errors
- Log errors for monitoring

### 2. Security
- Never expose API keys in client-side code
- Use server-side API routes for AI calls
- Implement input validation and sanitization

### 3. Performance
- Cache common responses
- Implement rate limiting
- Use streaming for long responses

### 4. Monitoring
- Track API usage and costs
- Monitor response times
- Set up alerts for failures

## Example Server-Side Implementation

```typescript
// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-service-example';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    
    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }
    
    // Generate AI response
    const response = await generateAIResponse(message, context);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
```

## Testing

### 1. Unit Tests
```typescript
// __tests__/ai-service.test.ts
import { generateAIResponse } from '@/lib/ai-service-example';

describe('AI Service', () => {
  test('should generate response for booking question', async () => {
    const response = await generateAIResponse('How do I book an item?', {});
    expect(response).toContain('book');
  });
});
```

### 2. Integration Tests
- Test with real API calls
- Verify error handling
- Check response quality

## Deployment Considerations

### 1. Environment Variables
- Set API keys in production environment
- Use different keys for staging/production
- Rotate keys regularly

### 2. Monitoring
- Set up API usage dashboards
- Monitor costs and usage
- Implement alerting for failures

### 3. Scaling
- Consider using multiple AI providers
- Implement load balancing
- Cache responses for common questions

## Cost Optimization

### 1. Caching
- Cache common responses
- Use shorter prompts when possible
- Implement conversation context limits

### 2. Fallbacks
- Use FAQ database for common questions
- Implement rule-based responses
- Provide human escalation options

### 3. Monitoring
- Track token usage
- Set spending limits
- Monitor response quality

## Conclusion

This guide provides a comprehensive approach to integrating real AI services with the Leli Rentals platform. Choose the service that best fits your needs, budget, and technical requirements.

For questions or support, contact the development team or refer to the official documentation of your chosen AI service provider.
