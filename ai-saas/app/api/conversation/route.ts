import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    console.log("amannnnnnnnnnnnnnnnnnnnnnnnnn",process.env.OPENAI_API_KEY)

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    console.log("messageeeeeeeeeeeeeee", messages)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    console.log("response", response)

    console.log(response.choices[0].message);
    const theResponse = response.choices[0].message;

    return NextResponse.json({ output: theResponse }, { status: 200 });
  } catch (error) {
    console.log("Conversation error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
