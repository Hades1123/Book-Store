import { registerAs } from '@nestjs/config';

export default registerAs(
  'external',
  () =>
    ({
      gmailAppPass: process.env.GMAIL_APP_PASS as string,
      gmailUserName: process.env.GMAIL_USER_NAME as string,
      cloudinaryName: process.env.CLOUDINARY_NAME as string,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
    }) as const,
);
