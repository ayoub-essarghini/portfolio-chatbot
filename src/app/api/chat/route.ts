import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

export const maxDuration = 60;

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
const INDEX_NAME = 'portfolio-chat';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    
    // Extract query text - handle both 'content' and 'parts' formats
    let queryText = '';
    if (typeof lastMessage.content === 'string') {
      queryText = lastMessage.content;
    } else if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
      const textPart = lastMessage.parts.find((p: { type: string }) => p.type === 'text');
      queryText = textPart?.text || '';
    }

    if (!queryText) {
      return new Response('No query text found', { status: 400 });
    }

    // 1. Retrieve relevant context from Pinecone
    const vector = await embeddings.embedQuery(queryText);
    const index = pinecone.Index(INDEX_NAME);

    const queryResponse = await index.query({
      vector: vector,
      topK: 3,
      includeMetadata: true,
    });

    const context = (queryResponse.matches || [])
      .map(match => match.metadata?.text)
      .filter(Boolean)
      .join('\n\n');

    // 2. Format messages for streamText
    const formattedMessages = messages.map((m: { role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' 
        ? m.content 
        : m.parts?.find(p => p.type === 'text')?.text || '',
    }));

    // 3. Generate response with context
    const result = streamText({
      model: openai('gpt-4-turbo'),
      messages: formattedMessages,
      system: `You ARE Ayoub Essarghini, a Software Engineer. Respond in first person as if you are Ayoub himself.
      
      When someone asks about your skills, experience, or background, answer as yourself using "I", "my", "me".
      Be friendly, professional, and conversational. If asked something not in the context, say "I don't think I've shared that information in my portfolio."
      
      Here is information about yourself to reference:
      ${context}`,
    });

    // Return UI message stream for useChat compatibility
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
