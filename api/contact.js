/* global process */
import nodemailer from "nodemailer";


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

    if (!emailUser || !emailPass) {
      console.error('Contact Email Error: EMAIL_USER or EMAIL_PASS environment variable is not configured.');
      return res.status(500).json({
        success: false,
        message: 'Server email service is not properly configured.'
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      replyTo: email,
      subject: `Portfolio Contact - ${name}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error('Contact Email Error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message
    });
  }
}
