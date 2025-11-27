export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  console.log("Incoming Slack Event:", req.body);

  // Slack URL verification
  if (req.body?.type === "url_verification") {
    return res.status(200).send(req.body.challenge);
  }

  // Mandatory fast response
  return res.status(200).send("OK");
}
