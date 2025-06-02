import { z } from "zod";

// export const signUpSchema = z.object({
//   body: z
//     .object({
//       email: z.string().email(),
//       password: z.string().min(8).optional(),
//       role: z.enum(["admin", "organizer", "attendee"]),
//       provider: z.enum(["google", "facebook"]).optional(),
//       name: z.string().min(1),
//       bio: z.string().min(1).optional(),
//       image_url: z.string().optional(),
//       thumbnails_url: z.string().optional(),
//     })
//     .refine((data) => !(data.provider && data.password), {
//       message: "OAuth users should not have password",
//       path: ["password"],
//     })
//     .refine((data) => !data.provider || data.password === undefined, {
//       message: "Password is required for non-OAuth users",
//       path: ["password"],
//     }),
//   query: z.any(),
//   params: z.any(),
// });

export const signUpSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z.string().min(8).optional().or(z.literal("")),
      hashedpassword: z.any(),
      role: z.enum(["admin", "organizer", "attendee"]),
      provider: z.enum(["google", "facebook"]).optional(),
      name: z.string().min(1),
      bio: z.string().min(1).optional(),
      image_url: z.string().optional(),
      thumbnail_url: z.string().optional(),
    })
    .refine((data) => !(data.provider && data.password), {
      message: "OAuth users should not have password",
      path: ["password"],
    })
    .refine(
      (data) => data.provider || (data.password && data.password.length >= 8),
      {
        message:
          "Password is required and must be at least 8 characters for non-OAuth users",
        path: ["password"],
      }
    ),
  query: z.any(),
  params: z.any(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type signUpInput = z.infer<typeof signUpSchema>["body"];
