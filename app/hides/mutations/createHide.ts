import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateHide = z.object({
  commentId: z.number().optional().nullable(),
  entryId: z.number().optional().nullable(),
})

export default resolver.pipe(resolver.zod(CreateHide), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const hide = await db.hide.create({
    data: {
      ...input,
      userId: ctx.session.userId,
    },
  })

  return hide
})
