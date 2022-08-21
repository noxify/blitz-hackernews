import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetVotesInput
  extends Pick<
    Prisma.VoteFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetVotesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: votes,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.vote.count({ where }),
      query: (paginateArgs) =>
        db.vote.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      votes,
      nextPage,
      hasMore,
      count,
    };
  }
);
