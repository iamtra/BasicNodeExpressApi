// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const clients = new Map();

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  const clientId = Date.now();
  clients.set(clientId, res);

  console.log("Client connected:", clientId);

  // initial message
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ id: clientId })}\n\n`);

  // heartbeat
  const heartbeat = setInterval(() => {
    res.write(`event: ping\ndata: {}\n\n`);
  }, 15000);


  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(clientId);
    console.log("Client disconnected:", clientId);
  });
});

/* broadcast function */
function sendToAll(event, data) {
  const payload =
    `event: ${event}\n` +
    `data: ${JSON.stringify(data)}\n\n`;
  console.log(payload)
  for (const [, res] of clients) {
    res.write(payload);
  }
}

/* API to send data */
app.post("/send", (req, res) => {
  const { message } = req.body;

  sendToAll("message", {
    text: message,
    time: new Date().toLocaleTimeString(),
  });

  res.json({ success: true });
});

  let sendCount = 0

/* auto push every 3s (demo real-time feed) */
setInterval(() => {
  sendToAll("message", {
    text: `${"No."} ${sendCount++} ${"Auto update from server"}`,
    time: new Date().toLocaleTimeString(),
  });
}, 3000);

app.listen(3000, () => {
  console.log("SSE server running at http://localhost:3000");
});
