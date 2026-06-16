import nodemailer from "nodemailer";

const RECIPIENT = "INFO@SNSSGROUP.COM";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { fullName, company, email, phone, city, service, source, message, _honey } = req.body || {};

  if (_honey) {
    return res.status(200).json({ success: true });
  }

  if (!fullName || !email || !phone || !city || !service || !source) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
    return res.status(500).json({ success: false, message: "Server is not configured to send mail" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const html = `
    <h2>New enquiry — SNSS Global Services website</h2>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Company:</strong> ${company || "—"}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>City:</strong> ${city}</p>
    <p><strong>Service Required:</strong> ${service}</p>
    <p><strong>Heard about us via:</strong> ${source}</p>
    <p><strong>Message:</strong><br>${(message || "—").replace(/\n/g, "<br>")}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"SNSS Website" <${gmailUser}>`,
      to: RECIPIENT,
      replyTo: email,
      subject: `New enquiry from ${fullName} — ${service}`,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send mail:", err);
    return res.status(500).json({ success: false, message: "Failed to send mail" });
  }
}
