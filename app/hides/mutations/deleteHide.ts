import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteHide = z.object({
  commentId: z.number().optional().nullable(),
  entryId: z.number().optional().nullable(),
})

export default resolver.pipe(resolver.zod(DeleteHide), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const hide = await db.hide.findFirst({
    where: {
      ...input,
      userId: ctx.session.userId,
    },
  })

  await db.hide.delete({
    where: {
      id: hide?.id,
    },
  })
})
