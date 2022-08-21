import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateHide = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateHide),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const hide = await db.hide.create({ data: input });

    return hide;
  }
);
