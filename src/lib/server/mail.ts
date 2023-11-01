import { z } from 'zod';
import { createTransport } from 'nodemailer';
import { MAIL_AUTH } from '$env/static/private';

const smtpSchema = z.object({
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

// const toCid = (id: string) => `${id}@knihovnik.vercel.com`;

export async function sendRegistrationEmail(
  name: string,
  address: string,
  url: string,
) {
  const options = smtpSchema.parse(JSON.parse(MAIL_AUTH));

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
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const options = smtpSchema.parse(JSON.parse(MAIL_AUTH));

  const text = 'Resetujte své heslo na adrese: ' + url;
  const html = `Resetujte své heslo na adrese:<br><a href="${url}">${url}</a>`;

  const transporter = createTransport({ ...options });
  await transporter.sendMail({
    from: {
      name: 'Knihovník Bot',
      address: options.from,
    },
    to,
    subject: 'Reset hesla | Knihovník',
    text,
    html,
  });
}
