const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN; // Make sure you set this in Vercel

export default async function handler(req, res) {
  console.log("Incoming request:", req.method);

  if (req.method === "POST") {
    const body = req.body;
    console.log("Slack body:", body);

    // Slack challenge verification
    if (body.type === "url_verification") {
      return res.status(200).send(body.challenge);
    }

    // Handle app mentions
    if (body.event && body.event.type === "app_mention") {
      const { text, channel } = body.event;

      // Remove bot mention (e.g., "<@U0A110VGXJ4>") from text
      const botIdPattern = /<@[\w]+>/;
      const cleanedText = text.replace(botIdPattern, "").trim();

      // Post the cleaned message back to the same channel
      try {
        const response = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          },
          body: JSON.stringify({
            channel: channel,
            text: cleanedText,
          }),
        });

        const data = await response.json();
        console.log("Slack postMessage response:", data);
      } catch (error) {
        console.error("Error posting message to Slack:", error);
      }
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ message: "Slack Event endpoint running!" });
}





// // api/slack/events.js
// export default async function handler(req, res) {
//   console.log("Incoming request:", req.method);

//   if (req.method === "POST") {
//     const body = req.body;

//     console.log("Slack body:", body);

//     // Slack challenge verification
//     if (body.type === "url_verification") {
//       return res.status(200).send(body.challenge);
//     }

//     // Log message events
//     if (body.event) {
//       console.log("Slack Event:", body.event);
//     }

//     return res.status(200).json({ ok: true });
//   }

//   return res.status(200).json({ message: "Slack Event endpoint running!" });
// }
