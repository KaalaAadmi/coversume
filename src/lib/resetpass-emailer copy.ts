import nodemailer from "nodemailer";

export const verifySendEmail = async ({
  name,
  email,
  otp,
  userId,
}: {
  name: string;
  email: string;
  otp: string;
  userId: string;
}) => {
  try {
    // TODO: configure mail for usage
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: true,
      auth: {
        // TODO: replace with your email and password
        user: process.env.MAILTRAP_USER || "",
        pass: process.env.MAILTRAP_TOKEN || "",
      },
    });

    const mailOptions = {
      from: "demomailtrap.co", //sender address
      to: email, // list of receivers
      subject: "Verify your email", // Subject line
      // emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      // text: "", // plain text body
      html: "", // html body
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
