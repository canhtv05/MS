import { z } from 'zod/v4';

export const signInSchema = z.object({
  username: z.string().min(1, 'V'),
  password: z.string().min(1, 'V'),
});
