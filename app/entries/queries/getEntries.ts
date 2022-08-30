import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetEntriesInput
  extends Pick<Prisma.EntryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}
export default resolver.pipe(async ({ where, orderBy, skip = 0, take = 100 }: GetEntriesInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: entries,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,

    count: () => db.entry.count({ where }),
    query: (paginateArgs) =>
      db.entry.findMany({
        ...paginateArgs,
        where,
        orderBy,
        include: { author: true, comments: true, votes: {} },
      }),
  })

  return {
    entries,
    nextPage,
    hasMore,
    count,
  }
})
