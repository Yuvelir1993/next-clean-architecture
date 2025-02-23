import { z } from "zod";

export const USER_TYPE_SIGN_UP: string = "signup";
export const USER_TYPE_SIGN_IN: string = "signin";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(255),
});

export type User = z.infer<typeof userSchema>;

export const signUpUserSchema = userSchema
  .pick({ username: true, email: true, id: true })
  .merge(
    z.object({
      password: z.string().min(6).max(255),
      type: z.literal(USER_TYPE_SIGN_UP),
    })
  );

export type SignUpUser = z.infer<typeof signUpUserSchema>;

export const signInUserSchema = userSchema.pick({ email: true }).merge(
  z.object({
    password: z.string().min(6).max(255),
    type: z.literal(USER_TYPE_SIGN_IN),
  })
);

export type SignInUser = z.infer<typeof signInUserSchema>;
