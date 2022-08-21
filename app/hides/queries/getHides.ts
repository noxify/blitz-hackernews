import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetHidesInput
  extends Pick<
    Prisma.HideFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetHidesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: hides,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.hide.count({ where }),
      query: (paginateArgs) =>
        db.hide.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      hides,
      nextPage,
      hasMore,
      count,
    };
  }
);
