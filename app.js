// server.js (CommonJS version)
const express = require("express");
const fetch = require("node-fetch"); // Node 18+ has fetch natively
require("dotenv").config();

const app = express();
app.use(express.json());

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

app.post("/slack/events", async (req, res) => {
  try {
    const body = req.body;

    if (body.type === "url_verification") {
      return res.json({ challenge: body.challenge });
    }

    if (body.event && body.event.type === "app_mention") {
      const { text, channel } = body.event;
      const cleanedText = text.replace(/<@[^>]+>/g, "").trim();

      fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        },
        body: JSON.stringify({
          channel: channel,
          text: cleanedText || "Hello! You mentioned me.",
        }),
      }).catch(console.error);

      return res.sendStatus(200);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
