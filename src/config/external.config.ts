import { registerAs } from '@nestjs/config';

export default registerAs(
  'external',
  () =>
    ({
      gmailAppPass: process.env.GMAIL_APP_PASS ?? '',
    }) as const,
);
