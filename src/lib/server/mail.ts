import { createTransport } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer/";
import { MAIL_AUTH } from "$env/static/private";

export interface MailImage {
  id: string;
  alt: string;
  content: URL;
}

const toCid = (id: string) => `${id}@knihovnik.vercel.com`;

export async function sendTicket(
  name: string,
  address: string,
  images: MailImage[]
) {
  const auth = JSON.parse(MAIL_AUTH);

  const text = "Zdar kámarádstvo!";

  const html =
    "<h2>Zdar kamarádstvo!</h2>" +
    images
      .map(({ id, alt }) => `<img alt="${alt}" src="cid:${toCid(id)}">`)
      .join("");

  const transporter = createTransport({ ...auth });
  await transporter.sendMail({
    from: {
      name: "Artyparty Bot",
      address: auth.auth.user,
    },
    to: "m93a.cz@gmail.com",
    subject: "Vstupenka na Artyparty",
    text,
    html,
    attachments: images.map(
      ({ content, id }, i): Attachment => ({
        path: content.toString(),
        cid: toCid(id),
      })
    ),
  });
}
