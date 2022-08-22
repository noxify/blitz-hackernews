import { resolver } from "@blitzjs/rpc"
import { CreateEntry } from "app/entries/validations"
import { getSiteName } from "app/helper"
import db from "db"
import { z } from "zod"

export default resolver.pipe(
  resolver.zod(CreateEntry),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const entry = await db.entry.create({
      data: {
        ...input,
        authorId: ctx.session.userId,
        siteName: input.link && input.link != "" ? getSiteName(input.link) : null,
      },
    })

    return entry
  }
)
