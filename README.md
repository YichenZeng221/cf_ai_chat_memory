# AI Chat with Memory — Built on Cloudflare Workers + Workers AI

This project is an AI-powered chatbot with **conversation memory**, built entirely on **Cloudflare Workers**, **Workers AI**, **Durable Objects**, and **HTML/CSS/JS**.

It is created as part of the **Cloudflare Software Engineer Internship — Optional Assignment**, demonstrating my ability to work with Cloudflare's edge runtime, AI models, and persistent state.

---

## Features

### 1. **AI Chatbot Powered by Workers AI**
Uses Cloudflare’s fast inference runtime and the `@cf/meta/llama-3.1-8b-instruct` model to generate natural, contextual responses.

### 2. **Durable Objects for Persistent Memory**
All messages are stored using a Durable Object named `ChatMemory`, enabling:
- multi-turn conversation
- full history retrieval
- consistent memory per session

### 3. **Beautiful Chat UI**
A responsive, clean UI built with pure HTML/CSS/JavaScript:
- modern bubble-style chat layout  
- auto-scrolling  
- mobile-friendly  
- real-time rendering

### 4. **Supports English + multilingual input**
The system prompt allows the AI to respond in multiple languages based on user input.

