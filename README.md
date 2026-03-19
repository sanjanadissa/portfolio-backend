# 🤖 AI Portfolio Assistant Backend (RAG System)

This is the backend of my **AI-powered portfolio assistant**, designed to provide interactive, context-aware responses about my work, projects, and experience.

Instead of a traditional static portfolio, this system allows visitors to **chat and explore dynamically**, powered by a Retrieval-Augmented Generation (RAG) pipeline.

---

## 🚀 Overview

This backend combines:

* **LLM (Large Language Model)** for generating responses
* **Vector Database** for semantic search
* **Embeddings** for understanding user queries
* **Memory system** for conversational context

👉 Result: An AI assistant that **doesn’t guess** — it **retrieves real data first, then answers**.

---

## 🧠 How It Works (RAG Pipeline)

```
User Question
     ↓
Generate Embedding (Hugging Face)
     ↓
Search Similar Data (Upstash Vector DB)
     ↓
Retrieve Context (Resume + GitHub + Custom Data)
     ↓
Add Conversation Memory (Redis)
     ↓
Send to LLM (Groq - LLaMA 3.1)
     ↓
Generate Answer
```

---

## 💡 Key Features

### 🔍 Retrieval-Augmented Generation (RAG)

* Answers are generated using **real data**, not assumptions
* Data sources:

  * Resume (PDF → chunked → embedded)
  * GitHub repositories (auto-fetched)
  * Custom knowledge base

---

### ⚡ Fast AI Responses

* Powered by **Groq API (LLaMA 3.1)** for ultra-low latency
* Optimized for real-time chat experience

---

### 🧠 Context-Aware Conversations

* Stores recent chat history using **Upstash Redis**
* Maintains conversation flow across messages

---

### ✂️ Smart Memory Optimization

* Automatically summarizes long conversations
* Prevents token overflow and improves performance

---

### 🔄 Automated GitHub Indexing

* Fetches repositories via GitHub API
* Extracts:

  * Repo details
  * README content
* Converts into embeddings and stores in vector DB
* Can be triggered via **cron job**

---

## 🏗️ Tech Stack

| Component  | Technology                      |
| ---------- | ------------------------------- |
| LLM        | LLaMA 3.1 (Groq API)            |
| Embeddings | Hugging Face (all-MiniLM-L6-v2) |
| Vector DB  | Upstash Vector                  |
| Memory     | Upstash Redis                   |
| Backend    | Node.js + Express               |
| Hosting    | Railway                         |

---

## 📁 Project Structure

```
backend/
│
├── chat/
│   └── api.js              # Main chat endpoint (RAG logic)
│
├── lib/
│   ├── embeddings.js      # Generate embeddings (Hugging Face)
│   ├── vector.js          # Vector DB query & upsert
│   ├── memory.js          # Redis-based chat memory
│
├── scripts/
│   ├── indexGithub.js     # Index GitHub repos
│   ├── indexResume.js     # Extract + chunk + embed PDF
│
├── server.js              # Express server
├── .env                   # Environment variables
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_hf_key

UPSTASH_VECTOR_REST_URL=your_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_vector_token

UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token

GITHUB_USERNAME=your_username
GITHUB_TOKEN=your_github_token

CRON_SECRET=your_secret
```

---

## ▶️ Running the Project

### 1. Install dependencies

```
npm install
```

### 2. Start server

```
node server.js
```

Server runs on:

```
http://localhost:3001
```

---

## 🔁 API Endpoint

### POST `/api/chat`

**Request:**

```json
{
  "sessionId": "user123",
  "message": "Tell me about Sanjana's projects"
}
```

**Response:**

```json
{
  "reply": "..."
}
```

---

## 📚 Data Indexing

### 🔹 Index Resume (PDF → Vector DB)

```
node scripts/indexResume.js
```

### 🔹 Index GitHub Repositories

```
node scripts/indexGithub.js
```

---

## ☁️ Deployment

* Hosted on **Railway**
* Supports:

  * Environment variables
  * Cron jobs (for GitHub re-indexing)
  * Scalable backend deployment

---

## 🧪 Future Improvements

* Streaming responses (real-time typing)
* Better chunking strategies
* Multi-user long-term memory
* Admin dashboard for knowledge updates

---

## 🤝 Contributing

Feel free to fork, explore, and improve this project. Suggestions and feedback are always welcome!

---

## 📌 Summary

This project demonstrates how to build a **real-world AI agent** using:

* RAG architecture
* Vector databases
* LLM APIs
* Memory systems

👉 Turning a static portfolio into an **interactive AI experience**.

---

⭐ If you found this useful, consider giving it a star!
