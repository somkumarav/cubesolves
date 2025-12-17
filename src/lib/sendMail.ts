import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

export const sendMail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_ID) {
      console.error("Email environment variables are missing.");
      throw new Error("Email service is currently unavailable.");
    }
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"cubesolves" <${process.env.EMAIL_ID}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Message sent:", info.messageId);
    console.log(
      "Preview URL (if using ethereal):",
      nodemailer.getTestMessageUrl(info)
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
