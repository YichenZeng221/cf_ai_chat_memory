// Durable Object: Stores chat history
export class ChatMemory {
    constructor(state) {
        this.state = state;
    }

    async fetch(request) {
        const { action, message, role } = await request.json();

        if (action === "add") {
            let history = (await this.state.storage.get("history")) || [];

            // Only store valid chat messages
            if (typeof message === "string" && typeof role === "string") {
                history.push({ role, content: message });
                
                //  BONUS 3: Limit memory length (best practice for token management)
                if (history.length > 20) {
                    history.shift(); // Remove oldest message
                }
                
                await this.state.storage.put("history", history);
            }

            return new Response(JSON.stringify({ ok: true }));
        }

        if (action === "get") {
            const history = (await this.state.storage.get("history")) || [];
            return new Response(JSON.stringify(history), {
                headers: { "Content-Type": "application/json" },
            });
        }

        //  BONUS 1: Clear memory functionality
        if (action === "clear") {
            await this.state.storage.delete("history");
            return new Response(JSON.stringify({ ok: true }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response("Invalid action", { status: 400 });
    }
}

// HTML UI with all bonus features
const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chat with Memory</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #6A5ACD 0%, #4B0082 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      transition: background 0.3s;
    }
    
    /*  BONUS 5: Dark Mode */
    body.dark {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%);
    }
    
    .chat-box {
      background: white;
      width: 90%;
      max-width: 600px;
      height: 85vh;
      max-height: 800px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      transition: background 0.3s, color 0.3s;
    }
    
    body.dark .chat-box {
      background: #16213e;
      color: #e0e0e0;
    }
    
    .header {
      background: #6A5ACD;
      padding: 16px;
      color: white;
      font-size: 20px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    body.dark .header {
      background: #0f3460;
    }
    
    .header-title {
      flex: 1;
      text-align: center;
    }
    
    .header-buttons {
      display: flex;
      gap: 8px;
    }
    
    .icon-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    
    .icon-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f5f5f5;
    }
    
    body.dark .messages {
      background: #1a1a2e;
    }
    
    .msg {
      padding: 12px 16px;
      border-radius: 14px;
      max-width: 80%;
      animation: slideIn 0.3s ease;
      word-wrap: break-word;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .user {
      background: #6A5ACD;
      color: white;
      align-self: flex-end;
    }
    
    .assistant {
      background: #e6e6e6;
      color: #333;
      align-self: flex-start;
    }
    
    body.dark .assistant {
      background: #0f3460;
      color: #e0e0e0;
    }
    
    /*  BONUS 2: Typing Indicator */
    .typing {
      background: #e6e6e6;
      color: #666;
      align-self: flex-start;
      font-style: italic;
      animation: pulse 1.5s infinite;
    }
    
    body.dark .typing {
      background: #0f3460;
      color: #999;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    .input-area {
      padding: 16px;
      display: flex;
      gap: 10px;
      background: white;
      border-top: 1px solid #e0e0e0;
    }
    
    body.dark .input-area {
      background: #16213e;
      border-top-color: #0f3460;
    }
    
    input {
      flex: 1;
      padding: 12px 16px;
      border-radius: 20px;
      border: 1px solid #ccc;
      outline: none;
      background: white;
      color: #333;
      font-size: 15px;
    }
    
    body.dark input {
      background: #0f3460;
      color: #e0e0e0;
      border-color: #1a1a2e;
    }
    
    button {
      background: #6A5ACD;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      font-size: 15px;
      transition: background 0.2s;
    }
    
    button:hover {
      background: #5a4db7;
    }
    
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div class="chat-box">
    <div class="header">
      <div class="header-title">🤖 AI Chat with Memory</div>
      <div class="header-buttons">
        <button class="icon-btn" onclick="toggleDark()" title="Toggle Dark Mode" id="darkBtn">🌙</button>
        <button class="icon-btn" onclick="clearMemory()" title="Clear Memory">🗑️</button>
      </div>
    </div>
    
    <div class="messages" id="messages">
      <div class="msg assistant">Hi! I'm your AI assistant with memory. I can remember our conversation. How can I help you today?</div>
    </div>

    <div class="input-area">
      <input id="input" placeholder="Type a message..." onkeypress="if(event.key==='Enter') send()" />
      <button onclick="send()" id="sendBtn">Send</button>
    </div>
  </div>

  <script>
    const msgBox = document.getElementById("messages");
    const input = document.getElementById("input");
    const sendBtn = document.getElementById("sendBtn");
    const darkBtn = document.getElementById("darkBtn");

    function add(text, role) {
      const div = document.createElement("div");
      div.className = "msg " + role;
      div.textContent = text;
      msgBox.appendChild(div);
      msgBox.scrollTop = msgBox.scrollHeight;
      return div;
    }

    //  BONUS 2: Typing Indicator
    function showTyping() {
      const div = document.createElement("div");
      div.className = "msg typing";
      div.textContent = "AI is typing...";
      div.id = "typing-indicator";
      msgBox.appendChild(div);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    function hideTyping() {
      const indicator = document.getElementById("typing-indicator");
      if (indicator) indicator.remove();
    }

    async function send() {
      const text = input.value.trim();
      if (!text) return;

      add(text, "user");
      input.value = "";
      sendBtn.disabled = true;
      
      showTyping();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        hideTyping();
        add(data.reply, "assistant");
      } catch (error) {
        hideTyping();
        add("Error: " + error.message, "assistant");
      } finally {
        sendBtn.disabled = false;
      }
    }

    //  BONUS 1: Clear Memory
    async function clearMemory() {
      if (!confirm("Are you sure you want to clear all conversation history?")) return;
      
      try {
        const res = await fetch("/api/clear", {
          method: "POST"
        });
        
        if (res.ok) {
          msgBox.innerHTML = '<div class="msg assistant">Memory cleared! Starting a fresh conversation. 🆕</div>';
        }
      } catch (error) {
        alert("Failed to clear memory: " + error.message);
      }
    }

    //  BONUS 5: Dark Mode Toggle
    function toggleDark() {
      document.body.classList.toggle("dark");
      darkBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
      
      // Save preference
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    }
    
    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark");
      darkBtn.textContent = "☀️";
    }
  </script>
</body>
</html>`;

// Worker
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Serve HTML UI
        if (url.pathname === "/") {
            return new Response(HTML, {
                headers: { "Content-Type": "text/html;charset=UTF-8" },
            });
        }

        //  BONUS 1: Clear memory endpoint
        if (url.pathname === "/api/clear" && request.method === "POST") {
            const id = env.CHAT_MEMORY.idFromName("session-1");
            const stub = env.CHAT_MEMORY.get(id);
            
            await stub.fetch(new Request(url, {
                method: "POST",
                body: JSON.stringify({ action: "clear" }),
            }));
            
            return new Response(JSON.stringify({ ok: true }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Chat endpoint
        if (url.pathname === "/api/chat" && request.method === "POST") {
            const { message } = await request.json();

            const id = env.CHAT_MEMORY.idFromName("session-1");
            const stub = env.CHAT_MEMORY.get(id);

            // Save user message
            await stub.fetch(new Request(url, {
                method: "POST",
                body: JSON.stringify({ action: "add", role: "user", message }),
            }));

            // Retrieve history
            const historyResp = await stub.fetch(new Request(url, {
                method: "POST",
                body: JSON.stringify({ action: "get" }),
            }));
            const history = await historyResp.json();

            // Convert history to messages array
            const messages = [
                { role: "system", content: "You are a helpful AI assistant with memory. Keep responses concise and friendly." },
                ...history.map(h => ({
                    role: h.role,
                    content: h.content
                }))
            ];

            // Call Llama 3.1 8B
            const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
                messages,
                max_tokens: 300
            });

            const reply = ai.response;

            // Save assistant message
            await stub.fetch(new Request(url, {
                method: "POST",
                body: JSON.stringify({ action: "add", role: "assistant", message: reply }),
            }));

            return new Response(JSON.stringify({ reply }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response("Not found", { status: 404 });
    }
};
