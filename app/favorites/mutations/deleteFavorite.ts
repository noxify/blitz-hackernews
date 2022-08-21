import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteFavorite = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteFavorite),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const favorite = await db.favorite.deleteMany({ where: { id } });

    return favorite;
  }
);
