import fs from "fs";
import dotenv from "dotenv";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { generateEmbedding } from "../lib/embeddings.js";
import { upsertVector } from "../lib/vector.js";

dotenv.config({ path: "../.env" });

async function extractTextFromPDF(path) {
  const data = new Uint8Array(fs.readFileSync(path));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }
  return fullText;
}


function smartChunk(text, maxLength = 500, overlap = 100) {
  // 1. Split into sentences
  const sentences = text.split(/(?<=[.?!])\s+/);

  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    // If adding sentence exceeds max length
    if ((currentChunk + sentence).length > maxLength) {
      chunks.push(currentChunk.trim());

      // Add overlap (keep last part of previous chunk)
      currentChunk = currentChunk.slice(-overlap);
    }

    currentChunk += sentence + " ";
  }

  // Push last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  return chunks;

}

async function run(){
    try {
         const text = await extractTextFromPDF("../public/sanjana_ai_knowledge_profile-full.pdf");
         console.log(text)
         const chunks = smartChunk(text);

        for (let i = 0; i < chunks.length; i++) {
               const embedding = await generateEmbedding(chunks[i]);
               await upsertVector(`resume-${i}`, embedding, chunks[i]);
               console.log(`Indexed chunk ${i}`);
             }
         
        console.log("Resume indexed successfully");

    } catch (error) {
         console.error("Error indexing resume:", error);
         
    }
}

run()