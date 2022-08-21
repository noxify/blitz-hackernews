import { z } from "zod"

export const CreateEntry = z.object({
  type: z.enum(["general", "ask", "tell", "show"]),
  title: z.string().trim().min(1),
  link: z.string().url().nullable().optional().or(z.literal("")),
  content: z.string().nullable().optional().or(z.literal("")),
})
