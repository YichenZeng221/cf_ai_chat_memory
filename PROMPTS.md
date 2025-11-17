# PROMPTS.md

This document describes how I used AI assistance while building this project.

## My Development Process

I built this AI chatbot application by myself, with AI tools serving as a learning assistant — similar to how developers use documentation, Stack Overflow, or pair programming.

**What I did myself:**
- Designed the overall architecture (Durable Objects for state, Workers AI for inference)
- Wrote all the code structure and logic
- Made technical decisions (why Durable Objects vs KV, memory window size, etc.)
- Debugged issues and fixed errors
- Designed and implemented the UI

**How I used AI:
- Asked for explanations of Cloudflare APIs I hadn't used before
- Got help understanding error messages
- Requested code examples to learn syntax
- Discussed technical trade-offs and best practices

---

## Types of AI Prompts Used

### 1. Learning Cloudflare Workers

Since I was new to Cloudflare Workers, I used AI to understand the platform:

- "How do Durable Objects work? Explain with an example."
- "What's the difference between Durable Objects and Workers KV?"
- "Show me the basic structure of a Cloudflare Worker."
- "How do I bind Workers AI to my Worker?"

### 2. API Documentation Help

When official docs were unclear, I asked for clarification:

- "What's the correct format for calling Workers AI with Llama 3.1?"
- "How do I structure the messages array for chat completion?"
- "What properties does `state.storage` have in Durable Objects?"
- "How do I configure wrangler.toml for Durable Objects?"

### 3. Debugging Assistance

When I encountered errors, I asked AI to help me understand them:

- "I'm getting 'The string did not match the expected pattern' from Workers AI. What does this mean?"
- "Why is my Durable Object not persisting data between requests?"
- "My Worker returns 'OK' instead of the HTML page. What's wrong with my routing?"
- "How do I fix DNS_PROBE_FINISHED_NXDOMAIN for Workers?"

AI helped me understand the root cause, but I implemented the fixes myself.

### 4. UI/UX Implementation

For the frontend, I asked for guidance on best practices:

- "How do I make a chat interface scroll to the bottom automatically?"
- "What's a good CSS pattern for chat bubbles?"
- "How do I implement dark mode with localStorage?"
- "Show me how to create a typing indicator animation."

### 5. Code Review and Improvements

I asked AI to review my code and suggest improvements:

- "Is there a better way to manage conversation history?"
- "Should I limit the number of messages stored? Why?"
- "Review this code for potential issues."
- "What are best practices for error handling in Workers?"

---

## What AI Did NOT Do

- AI did not write the final application for me
- AI did not make architectural decisions
- AI did not design the data flow or state management
- AI did not debug the application end-to-end

I used AI as a **learning tool and reference**, not as a code generator.
