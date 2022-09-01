import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateVote = z.object({
  commentId: z.number().optional().nullable(),
  entryId: z.number().optional().nullable(),
})

export default resolver.pipe(resolver.zod(CreateVote), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const vote = await db.vote.create({
    data: {
      userId: ctx.session.userId,
      ...input,
    },
  })

  return vote
})
