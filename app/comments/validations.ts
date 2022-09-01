import { z } from "zod"

export const CommentValidation = z.object({
  content: z.string(),
})
