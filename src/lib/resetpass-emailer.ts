import nodemailer from "nodemailer";

export const resetSendEmail = async ({
  email,
  name,
  subject,
  text,
}: {
  email: string;
  name: string;
  subject: string;
  text: string;
}) => {
  try {
    // TODO: configure mail for usage
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace with your email and password
        user: process.env.MAILTRAP_USER || "",
        pass: process.env.MAILTRAP_TOKEN || "",
      },
    });

    const mailOptions = {
      // TODO: replace with your email with domain
      from: "hi@demomailtrap.co", //sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      // emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      // text: "", // plain text body
      html: `<p>Hello ${name},</p>
          <p>You requested a password reset.</p>
    <p>${text}</p>
    
    <p>If you did not request this, please ignore this email.</p>
  `, // html body
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
