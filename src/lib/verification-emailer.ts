import mailjet from "node-mailjet";

export const verificationSendEmail = async ({
  name,
  email,
  subject,
  url,
}: {
  name: string;
  email: string;
  subject: string;
  url: string;
}) => {
  try {
    const mj = mailjet.apiConnect(
      process.env.MAILJET_API_KEY as string,
      process.env.MAILJET_API_SECRET as string
    );
    const request = mj.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            // Email: "accounts@coversume.com",
            // TODO: replace with your email with domain
            Email: "sidehustyle13@gmail.com",
            Name: "Coversume Team - Reset Password",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: subject,
          HTMLPart: `<p>Hello,</p>
          <p>Please verify your email address</p>
          <p>Here is your email verification link: ${url}</p>
    
    <p>If you did not request this, please ignore this email.</p>
  `,
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
    console.log("Email sent successfully");
    console.log(request);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
