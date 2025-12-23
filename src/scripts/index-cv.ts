// scripts/index-cv.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs';

import path from 'path';
import pdf from 'pdf-parse';

// 1. Initialize Clients
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
const INDEX_NAME = 'portfolio-chat';

async function main() {
  // 1.1 Check and Create Index
  const existingIndexes = await pinecone.listIndexes();
  const indexExists = existingIndexes.indexes?.some(i => i.name === INDEX_NAME);

  if (!indexExists) {
    console.log(`Index ${INDEX_NAME} does not exist. Creating...`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: 1536, // OpenAI text-embedding-3-small dimension
      metric: 'cosine',
      spec: { 
        serverless: { 
          cloud: 'aws', 
          region: 'us-east-1' 
        }
      } 
    });
    console.log(`Index ${INDEX_NAME} created. Waiting for initialization...`);
    // Wait for the index to be ready (polite wait)
    await new Promise(resolve => setTimeout(resolve, 10000));
  } else {
    console.log(`Index ${INDEX_NAME} already exists.`);
  }

  // 2. Read and Chunk CV
  // Read the PDF file buffer
  const filePath = path.join(process.cwd(), 'public', 'cv.pdf');
  const pdfBuffer = fs.readFileSync(filePath);
  
  // Parse PDF to extract text
  const data = await pdf(pdfBuffer);
  const text = data.text;

  // Optional: Export to text file for verification
  fs.writeFileSync('cv_extracted.txt', text);
  console.log('Extracted text saved to cv_extracted.txt');

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // Small chunks work best for CVs
    chunkOverlap: 50,
  });
  const chunks = await splitter.createDocuments([text]);

  // 3. Embed and Upsert
  const index = pinecone.Index(INDEX_NAME);
  
  console.log(`Uploading ${chunks.length} chunks...`);

  // Simple batch process (production code should be more robust)
  for (const chunk of chunks) {
    const vector = await embeddings.embedQuery(chunk.pageContent);
    await index.upsert([{
      id: `chunk-${Date.now()}-${Math.random()}`,
      values: vector,
      metadata: { text: chunk.pageContent },
    }]);
  }
  console.log("Done!");
}

main();