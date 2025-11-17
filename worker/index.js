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

        return new Response("Invalid action", { status: 400 });
    }
}

// HTML UI
const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>AI Chat with Memory</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #6A5ACD;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .chat-box {
      background: white;
      width: 90%;
      max-width: 600px;
      height: 80vh;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .header {
      background: #6A5ACD;
      padding: 16px;
      color: white;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
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
    .msg {
      padding: 12px 16px;
      border-radius: 14px;
      max-width: 80%;
    }
    .user {
      background: #6A5ACD;
      color: white;
      align-self: flex-end;
    }
    .assistant {
      background: #e6e6e6;
      align-self: flex-start;
    }
    .input-area {
      padding: 16px;
      display: flex;
      gap: 10px;
    }
    input {
      flex: 1;
      padding: 12px;
      border-radius: 20px;
      border: 1px solid #ccc;
      outline: none;
    }
    button {
      background: #6A5ACD;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 20px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="chat-box">
    <div class="header">🤖 AI Chat with Memory</div>
    <div class="messages" id="messages">
      <div class="msg assistant">Hi! I'm your assistant. How can I help?</div>
    </div>

    <div class="input-area">
      <input id="input" placeholder="Type something..." />
      <button onclick="send()">Send</button>
    </div>
  </div>

  <script>
    const msgBox = document.getElementById("messages");
    const input = document.getElementById("input");

    function add(text, role) {
      const div = document.createElement("div");
      div.className = "msg " + role;
      div.textContent = text;
      msgBox.appendChild(div);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    async function send() {
      const text = input.value.trim();
      if (!text) return;

      add(text, "user");
      input.value = "";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      add(data.reply, "assistant");
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

        // Chat endpoint
        if (url.pathname === "/api/chat" && request.method === "POST") {
            const { message } = await request.json();

            const id = env.CHAT_MEMORY.idFromName("session-1");
            const stub = env.CHAT_MEMORY.get(id);

            // save user message
            await stub.fetch(new Request(url, {
                method: "POST",
                body: JSON.stringify({ action: "add", role: "user", message }),
            }));

            // retrieve history
            const historyResp = await stub.fetch(new Request(url, {
                method: "POST",
                body: JSON.stringify({ action: "get" }),
            }));
            const history = await historyResp.json();

            // Convert history to messages[]
            const messages = [
                { role: "system", content: "You are a helpful AI assistant with memory." },
                ...history.map(h => ({
                    role: h.role,
                    content: h.content
                }))
            ];

            // VALIDATED MODEL — This one 100% supports messages[]
            const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
                messages,
                max_tokens: 300
            });

            const reply = ai.response;

            // save assistant message
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
