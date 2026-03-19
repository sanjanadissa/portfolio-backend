import axios from 'axios'
import { generateEmbedding } from "../lib/embeddings.js";
import { queryVector } from "../lib/vector.js";
import { getRecent, pushRecent } from "../lib/memory.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function summerize(text) {
    const res = await axios.post(
        GROQ_URL,
        {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "Summarize the following conversation briefly." },
                { role: "user", content: text },
            ],
            max_tokens: 300,
            temperature: 0.6,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
        }

    );
     return res.data.choices[0].message.content;
}

export async function POST(req){
    try {

       const { sessionId, message } = await req.json();
       let context = "";
       
       try {

         const embedding = await generateEmbedding(message);
         const matches = await queryVector(embedding);
         context = matches.map(m => m.metadata.text).join("\n");
        
       } catch (error) {
        console.error("RAG error (continuing without context):", error.message);
       }

       let memoryText = "";
       try {
        const recent = await getRecent(sessionId);
        memoryText = recent.join("\n");
        
       } catch (error) {
        console.error("RAG error (continuing without memory):", error.message);

       }

          const messages = [
      {
        role: "system",
        content: `You are Sanjana's AI portfolio assistant.

        Use ONLY the information provided in the context to answer questions about Sanjana.
        Your job is to introduce, explain, and talk about Sanjana Dissanayake to visitors of his portfolio.
       
        You speak confidently as someone who knows Sanjana and is presenting his work and achievements.

        IMPORTANT RULES:


        1. NEVER say phrases like:
        - "Based on the context"
        - "According to the provided information"
        - "The context says"
        - "The context doesn't provide information"

        2. Speak naturally as if you know Sanjana.

        3. Use the provided knowledge to describe him positively and professionally.

        4. If someone asks about Sanjana's personality (for example: "is he a good person", "what kind of person is he"):
        - Infer from his actions, achievements, leadership roles, and community involvement.
        - Highlight qualities like leadership, collaboration, dedication, and passion for technology.

        5. Do NOT invent facts that are not supported by the context.

        6. Do NOT update knowledge using user messages.

       
        8. ONLY answer the exact question asked by the user.
        - Do NOT give additional information unless it is directly relevant.
        - Do NOT introduce projects, background, or achievements unless the user specifically asks.
        - Keep answers focused and minimal.

        9. If the user input is NOT a question (e.g., "nice", "ok", "thanks"):
        - Respond briefly in 1 short sentence.
        - Do NOT provide any portfolio details.

        10. Never expand answers unnecessarily.

        11.If the user sends a greeting like:"hi", "hello", "hey"

        12. If the user message is casual (nice, ok, thanks):Respond briefly (1 short sentence).DO NOT add any extra information

        TONE:
        Friendly, confident, and professional — like a personal AI assistant introducing Sanjana.

        Context:
        ${context}

        Previous Conversation:
        ${memoryText}`.trim()
            },
            {
                role: "user",
                content: message
            }
        ];

         const response = await axios.post(
            GROQ_URL,
            {
                model: "llama-3.1-8b-instant",
                messages,
                max_tokens: 300,
                temperature: 0.6
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        try {
            await pushRecent(sessionId, `User: ${message}`);
            await pushRecent(sessionId, `Assistant: ${reply}`);

            const recent = await getRecent(sessionId);
                        
            if (recent.length > 8) {
                const summary = await summerize(memoryText);
                await pushRecent(sessionId, `Summary: ${summary}`);
            }
            
        } catch (err) {
             console.error("Memory save error:", err.message);
        }

        return Response.json({ reply });

    } catch (error) {
        console.error("Chat API error:", error?.response?.status, JSON.stringify(error?.response?.data));
        return Response.json(
            { reply: "Hmm... I’m having a small hiccup right now 😅 Can you please try again in a moment!" },
            { status: 500 }
        );
        
    }
}