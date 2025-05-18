import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { name, email, subject, message } = body;
  const errors: string[] = [];
  const apiKey = process.env.MAILGUN_API_KEY || "API_KEY";
  const domain = process.env.MAILGUN_DOMAIN || "YOUR_DOMAIN_NAME";
  if (!apiKey || !domain) {
    return new Response(
      JSON.stringify({ error: "Mailgun API key or domain is not set." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  if (!name || name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address.");
  }
  if (!subject || subject.length < 2) {
    errors.push("Subject must be at least 2 characters long.");
  }
  if (!message || message.length < 5) {
    errors.push("Message must be at least 5 characters long.");
  }
  if (errors.length > 0) {
    return new NextResponse(JSON.stringify({ errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: apiKey,
    // When you have an EU-domain, you must specify the endpoint:
    url: "https://api.mailgun.net/",
  });
  try {
    const messageData = {
      from: "CoverSumé Contact <contact-form@coversume.com>",
      to: ["Side <sidehustyle13@gmail.com>"],
      subject: `New Contact Form Submission - ${subject}`,
      text: `Hello!\nYou have a new message from ${name} (${email}):\n\n${message}`,
    };

    const emailResponse = await mg.messages.create(domain, messageData);

    console.log(emailResponse); // logs response data
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error); //logs any error
  }
};
