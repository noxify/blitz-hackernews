import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteHide = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteHide),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const hide = await db.hide.deleteMany({ where: { id } });

    return hide;
  }
);
