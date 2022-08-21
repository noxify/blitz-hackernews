import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetFavoritesInput
  extends Pick<
    Prisma.FavoriteFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetFavoritesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: favorites,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.favorite.count({ where }),
      query: (paginateArgs) =>
        db.favorite.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      favorites,
      nextPage,
      hasMore,
      count,
    };
  }
);
