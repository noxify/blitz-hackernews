import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteVote = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteVote),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const vote = await db.vote.deleteMany({ where: { id } });

    return vote;
  }
);
