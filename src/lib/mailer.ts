import nodemailer from "nodemailer";

async function createTransporter() {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@api.dev",
    to,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password. It expires in 1 hour.</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>If you did not request this, ignore this email.</p>`,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
}
