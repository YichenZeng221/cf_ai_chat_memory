# PROMPTS.md
This document summarizes the types of AI-assisted prompts I used while developing this project.  
My usage of AI was limited to **documentation lookup**, **syntax confirmation**, and **debugging guidance**.  
All **architecture decisions**, **data flow design**, **Durable Object logic**, and the **final integrated implementation** were written and reasoned about by me.

Cloudflare explicitly allows candidates to use AI tools during the optional assignment, as long as the work is original — this project was fully implemented and debugged by myself.

---

## 1. Prompts used for documentation lookup
These prompts were used mainly to clarify Cloudflare APIs and confirm syntax details:

- *“What is the correct model ID format for Workers AI llama 3.x?”*
- *“Show me the expected input format for Workers AI when using the ‘messages’ parameter.”*
- *“How do I define a Durable Object binding inside wrangler.toml?”*
- *“What properties does the Durable Object ‘state.storage’ API provide?”*

I used these prompts in the same way developers typically consult docs, StackOverflow, or API references.

---

## 2. Prompts used for debugging guidance
These prompts were used only when I encountered specific errors:

- *“I’m receiving ‘The string did not match the expected pattern’ when calling Workers AI. What causes this?”*
- *“Why would a Worker return no response when env.AI is not properly bound?”*
- *“My HTML chat UI shifts upward when the keyboard appears on mobile Safari. What CSS property can prevent this?”*

AI tools helped me understand the cause of the error, but **I validated and applied the fixes myself**.

---

## 3. Prompts used for frontend refinement
These prompts focused on UI refinement, not logic:

- *“Give me CSS ideas for chat bubble styling similar to modern messaging apps.”*
- *“How do I make a scrollable message container auto-scroll to the bottom?”*
- *“What’s a clean way to animate message appearance using CSS?”*

All frontend layout choices (structure, component positioning, responsive adjustments) were implemented manually.

---

## 4. No code was copied directly
AI was **not** used to generate the final Worker file, Durable Object class, memory logic, or architectural design.  
Those portions were designed, implemented, and debugged by me based on Cloudflare's APIs.

The AI assistant functioned mainly as:

- a documentation reference tool  
- an error-explanation helper  
- a UI brainstorming aid  

Much like using MDN, StackOverflow, or Cloudflare Docs.

---

## 5. System prompt used inside the chatbot (production)
This is the only *runtime* AI prompt used inside the application, sent to Workers AI:

```text
You are a friendly, helpful assistant. You can respond in English or Chinese depending on the user's input. 
Use the conversation history as memory to provide coherent responses. Be concise and supportive.
