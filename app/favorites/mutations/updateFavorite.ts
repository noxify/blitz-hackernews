import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateFavorite = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateFavorite),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const favorite = await db.favorite.update({ where: { id }, data });

    return favorite;
  }
);
