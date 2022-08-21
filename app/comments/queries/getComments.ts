import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetCommentsInput
  extends Pick<
    Prisma.CommentFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCommentsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: comments,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.comment.count({ where }),
      query: (paginateArgs) =>
        db.comment.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      comments,
      nextPage,
      hasMore,
      count,
    };
  }
);
