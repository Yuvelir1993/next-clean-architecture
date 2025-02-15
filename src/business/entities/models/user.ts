import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(255),
});

export type User = z.infer<typeof userSchema>;

export const signUpUserSchema = userSchema
  .pick({ id: true, username: true, email: true })
  .merge(z.object({ password: z.string().min(6).max(255) }));

export type SignUpUser = z.infer<typeof signUpUserSchema>;

export const signInUserSchema = userSchema
  .pick({ username: true, email: true })
  .merge(z.object({ password: z.string().min(6).max(255) }));

export type SignInUser = z.infer<typeof signUpUserSchema>;
