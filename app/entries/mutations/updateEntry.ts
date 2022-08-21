import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateEntry = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateEntry),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const entry = await db.entry.update({ where: { id }, data });

    return entry;
  }
);
