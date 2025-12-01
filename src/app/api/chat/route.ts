import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HF_API_TOKEN);

export async function POST(req: Request) {
  // Check for API token
  if (!process.env.HF_API_TOKEN) {
    return NextResponse.json(
      { error: 'Missing HF_API_TOKEN in environment variables' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Call Hugging Face Inference API
    const response = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
