import z from 'zod';

export const registerSchema = z
  .object({
    email: z.email({ error: 'Invalid email' }),
    fullName: z
      .string()
      .trim()
      .min(5, { error: 'Your name must have more than 4 characters' }),
    phone: z.string().trim().nonempty({ error: 'phone must not be empty' }),
    password: z
      .string()
      .min(5, { error: 'password length MUST greater or equal 5' })
      .max(12, { error: 'password length MUST less than or equal 12' })
      .regex(/(?=.*[a-z])/, { error: 'Must have a lowercase' })
      .regex(/(?=.*[A-Z])/, { error: 'Must have an uppercase' })
      .regex(/(?=.*\d)/, { error: 'Must have a number' })
      .regex(/(?=.*[!@#$%^&*])/, { error: 'Must have a special character' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password don't match",
    path: ['confirmPassword'],
  });
