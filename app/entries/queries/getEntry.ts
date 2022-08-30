import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetEntry = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetEntry), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const entry = await db.entry.findFirst({
    where: { id },
    include: { votes: true, author: true, comments: true },
  })

  if (!entry) throw new NotFoundError()

  return entry
})
