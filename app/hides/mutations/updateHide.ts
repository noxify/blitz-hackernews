import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateHide = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateHide),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const hide = await db.hide.update({ where: { id }, data });

    return hide;
  }
);
