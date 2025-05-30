import { z } from "zod";

export const signUpSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z.string().min(8).optional().or(z.literal("")),
      role: z.enum(["admin", "organizer", "attendee"]),
      provider: z.enum(["google", "facebook"]).optional(),
      name: z.string().min(1),
      bio: z.string().min(1).optional(),
      image_url: z.string().optional(),
    })
    .refine((data) => {
      if (data.provider && data.password)
        return {
          message: "Oauth users should not have password",
          path: ["password"],
        };
      if (!data.provider && !data.password)
        return {
          message: "Password is required for non-OAuth users",
          path: ["password"],
        };
      return true;
    }),
  query: z.any(),
  params: z.any(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "email nny" }),
    password: z.string().min(8),
  }),
});

export type signUpInput = z.infer<typeof signUpSchema>["body"];
