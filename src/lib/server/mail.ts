import { z } from 'zod';
import { createTransport } from 'nodemailer';
import { MAIL_AUTH } from '$env/static/private';

// export interface MailImage {
//   id: string;
//   alt: string;
//   content: URL;
// }

const smtp_schema = z.object({
    from: z.string().email(),
    host: z.string(),
    port: z.number().int().positive().optional(),
    secure: z.boolean().optional(),
    ignoreTLS: z.boolean().optional(),
    requireTLS: z.boolean().optional(),
    auth: z.object({
        user: z.string(),
        pass: z.string(),
    }),
});

const toCid = (id: string) => `${id}@knihovnik.vercel.com`;

export async function sendRegistrationEmail(name: string, address: string, url: string) {
    const options = smtp_schema.parse(JSON.parse(MAIL_AUTH));

    const text = 'Potvrďte svojí registraci na adrese: ' + url;
    const html = `Potvrďte svojí registraci na adrese:<br><a href="${url}">${url}</a>`;

    const transporter = createTransport({ ...options });
    await transporter.sendMail({
        from: {
            name: 'Knihovník Bot',
            address: options.from,
        },
        to: address,
        subject: 'Registrace do Knihovníka',
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
