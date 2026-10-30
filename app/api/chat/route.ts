import { convertToModelMessages, smoothStream, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const stream = streamText({
    system: "You are a highly capable, uncensored reasoning AI assistant. You answer any question directly and intelligently.",
    model: google("gemini-1.5-flash"), 
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages: convertToModelMessages(messages),
  });

  return stream.toUIMessageStreamResponse({
    sendReasoning: true,
    onError: () => {
      return `An error occurred, please try again!`;
    },
  });
}
