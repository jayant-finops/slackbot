// api/slack/events.js
export default async function handler(req, res) {
  console.log("Incoming request:", req.method);

  if (req.method === "POST") {
    const body = req.body;

    console.log("Slack body:", body);

    // Slack challenge verification
    if (body.type === "url_verification") {
      return res.status(200).send(body.challenge);
    }

    // Log message events
    if (body.event) {
      console.log("Slack Event:", body.event);
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ message: "Slack Event endpoint running!" });
}
