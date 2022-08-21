import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteEntry = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteEntry),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const entry = await db.entry.deleteMany({ where: { id } });

    return entry;
  }
);
