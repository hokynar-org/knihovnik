import { createTransport } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer/";
import { MAIL_AUTH } from "$env/static/private";

// export interface MailImage {
//   id: string;
//   alt: string;
//   content: URL;
// }

const toCid = (id: string) => `${id}@knihovnik.vercel.com`;

export async function sendRegistrationEmail(
  name: string,
  address: string,
  url: string,
) {
  const auth = JSON.parse(MAIL_AUTH);
  const text = "Potvrďte svojí registraci na adrese:"+url;
  const html = `Potvrďte svojí registraci na adrese: <a href=${url}>${url}</a>`;
    // "<h2>Zdar kamarádstvo!</h2>" +
    // images
    //   .map(({ id, alt }) => `<img alt="${alt}" src="cid:${toCid(id)}">`)
    //   .join("");

  const transporter = createTransport({ ...auth });
  await transporter.sendMail({
    from: {
      name: "Knihovník Bot",
      address: auth.auth.user,
    },
    to: "ondrejkno2p@gmail.com",
    subject: "Registrace do Knihovníka",
    text,
    html,
    // attachments: images.map(
    //   ({ content, id }, i): Attachment => ({
    //     path: content.toString(),
    //     cid: toCid(id),
    //   })
    // ),
  });
}
