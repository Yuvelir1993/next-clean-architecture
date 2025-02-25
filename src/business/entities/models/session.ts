import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  sessionName: z.string(),
  userId: z.string(),
  userName: z.string(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;
