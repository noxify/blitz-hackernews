import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateComment = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateComment),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const comment = await db.comment.update({ where: { id }, data });

    return comment;
  }
);
