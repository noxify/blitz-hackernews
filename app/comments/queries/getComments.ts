import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetCommentsInput extends Pick<Prisma.CommentFindManyArgs, "where" | "orderBy"> {}

export default resolver.pipe(async ({ where, orderBy }: GetCommentsInput) => {
  return await db.comment.findMany({
    where,
    orderBy,
    include: { author: true, votes: true },
  })
})
