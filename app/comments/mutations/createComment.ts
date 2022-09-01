import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateComment = z.object({
  authorId: z.number(),
  entryId: z.number(),
  content: z.string(),
  parentId: z.number().optional().nullable(),
})

export default resolver.pipe(resolver.zod(CreateComment), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const comment = await db.comment.create({ data: input })

  return comment
})
