import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteVote = z.object({
  commentId: z.number().optional().nullable(),
  entryId: z.number().optional().nullable(),
})

export default resolver.pipe(resolver.zod(DeleteVote), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const vote = await db.vote.findFirst({
    where: {
      ...input,
      userId: ctx.session.userId,
    },
  })

  await db.vote.delete({
    where: {
      id: vote?.id,
    },
  })
})
