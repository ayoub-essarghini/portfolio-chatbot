# Portfolio ChatBot

### AI-Powered Personal Assistant

A RAG-based chatbot that answers questions about your resume and portfolio using GPT-4.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai)](https://openai.com/)

## ✨ Features

- 🎭 **First-Person AI** — The bot speaks AS you, not about you
- 🔍 **RAG-Powered** — Retrieves context from your CV/portfolio for accurate answers
- 💬 **Real-time Streaming** — Responses stream in character by character
- 🎨 **Premium UI** — Glassmorphism design with gradient effects
- 📱 **Responsive** — Works beautifully on all devices
- ⚡ **Fast** — Built on Next.js with Turbopack

---

## 🛠️ Tech Stack

| Category       | Technologies                      |
| -------------- | --------------------------------- |
| **Framework**  | Next.js 16, React 19              |
| **AI**         | Vercel AI SDK, OpenAI GPT-4 Turbo |
| **Vector DB**  | Pinecone                          |
| **Embeddings** | LangChain + OpenAI                |
| **Styling**    | Tailwind CSS 4                    |
| **Language**   | TypeScript                        |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ayoub-essarghini/portfolio-chatbot.git
cd portfolio-chatbot
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key (required)
# Get yours at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx

# Pinecone API Key (required)
# Get yours at: https://app.pinecone.io
PINECONE_API_KEY=pcsk_xxxxxxxxxxxxxxxxxxxx
```

### 3. Add Your CV/Portfolio

Place your CV as a PDF file at:

```
public/cv.pdf
```

### 4. Index Your Data

Run the ingestion script to process your CV and upload it to Pinecone:

```bash
npx tsx --env-file=.env.local src/scripts/index-cv.ts
```

You should see:

```
Index portfolio-chat does not exist. Creating...
Index portfolio-chat created. Waiting for initialization...
Extracted text saved to cv_extracted.txt
Uploading 7 chunks...
Done!
```

### 5. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
├── public/
│   └── cv.pdf              # Your CV/Portfolio PDF
├── src/
│   ├── app/
│   │   ├── api/chat/
│   │   │   └── route.ts    # Chat API with RAG
│   │   ├── page.tsx        # Chat UI
│   │   └── layout.tsx      # Root layout
│   └── scripts/
│       └── index-cv.ts     # Data ingestion script
├── .env.local              # Environment variables
└── package.json
```

---

## 🔧 Configuration

### Customizing the AI Personality

Edit the system prompt in `src/app/api/chat/route.ts`:

```typescript
system: `You ARE [Your Name], a [Your Role]. Respond in first person...`;
```

### Changing the Pinecone Index Name

Update the `INDEX_NAME` constant in both files:

- `src/scripts/index-cv.ts`
- `src/app/api/chat/route.ts`

---

## 📝 Environment Variables Reference

| Variable           | Required | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| `OPENAI_API_KEY`   | ✅       | Your OpenAI API key for GPT-4 and embeddings |
| `PINECONE_API_KEY` | ✅       | Your Pinecone API key for vector storage     |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

---

## 📄 License

MIT © [Ayoub Essarghini](https://github.com/ayoub-essarghini)

---

<p align="center">
  Made with ❤️ and ☕ by <a href="https://github.com/ayoub-essarghini">Ayoub</a>
</p>
