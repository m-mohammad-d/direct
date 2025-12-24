import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().min(1, "Display Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(180, "Bio is too long").optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ProfileForm = z.infer<typeof profileSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
