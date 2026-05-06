import { z } from "zod"

// ─── Login Schema ─────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  role: z.enum(["founder", "employee", "admin"]),
})
export type LoginInput = z.infer<typeof LoginSchema>

// ─── Founder Register Schema ──────────────────────────────────────────────
export const FounderRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    startupName: z.string().min(2, "Startup/Idea name is required").max(200),
    terms: z.boolean().refine((v) => v === true, "You must agree to the terms"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type FounderRegisterInput = z.infer<typeof FounderRegisterSchema>

// ─── Employee Register Schema ─────────────────────────────────────────────
export const EmployeeRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
    experience: z.enum(["junior", "mid", "senior", "lead"], {
      message: "Please select your experience level",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type EmployeeRegisterInput = z.infer<typeof EmployeeRegisterSchema>

// ─── Idea Schema ──────────────────────────────────────────────────────────
export const IdeaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Please provide more details (min 20 characters)"),
  industry: z.string().min(2, "Industry is required").max(100),
  stage: z.enum(["idea", "mvp", "growth"]),
})
export type IdeaInput = z.infer<typeof IdeaSchema>

// ─── Application Schema ───────────────────────────────────────────────────
export const ApplicationSchema = z.object({
  message: z.string().min(10, "Please write a brief message (min 10 characters)").max(1000),
})
export type ApplicationInput = z.infer<typeof ApplicationSchema>
