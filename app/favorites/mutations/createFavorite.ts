import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateFavorite = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateFavorite),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const favorite = await db.favorite.create({ data: input });

    return favorite;
  }
);
