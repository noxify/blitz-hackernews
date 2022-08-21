import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateVote = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateVote),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const vote = await db.vote.create({ data: input });

    return vote;
  }
);
