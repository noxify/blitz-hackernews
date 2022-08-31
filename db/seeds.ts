import db from "db"
import { faker } from "@faker-js/faker"
import { getSiteName } from "app/helper"

import { log } from "blitz"

const seed = async () => {
  const amountEntries = 100
  const generatedUsers: number[] = []
  const generatedGeneral: number[] = []

  const userLog = log.spinner("Generate users").start()
  for (let iUsers = 0; iUsers < 300; iUsers++) {
    const firstName = faker.name.firstName().toLowerCase()
    const lastName = faker.name.lastName().toLowerCase()
    const email = faker.internet.email(firstName, lastName)
    const seedRecord = await db.user.create({
      data: {
        email,
        name: `${firstName}.${lastName}`,
      },
    })

    generatedUsers.push(seedRecord.id)
  }
  const userCount = await db.user.count()

  userLog.succeed(`Generated ${userCount} users`)

  const entryLog = log.spinner("Generate entries").start()
  const julyGeneral = await createEntries({
    type: "general",
    amount: amountEntries,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustGeneral = await createEntries({
    type: "general",
    amount: amountEntries,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const julyAsk = await createEntries({
    type: "ask",
    amount: amountEntries,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustAsk = await createEntries({
    type: "general",
    amount: amountEntries,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const julyTell = await createEntries({
    type: "tell",
    amount: amountEntries,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustTell = await createEntries({
    type: "tell",
    amount: amountEntries,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const julyShow = await createEntries({
    type: "show",
    amount: amountEntries,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustShow = await createEntries({
    type: "show",
    amount: amountEntries,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const githubRecord = await db.entry.create({
    data: {
      type: "general",
      title: "Github Link Example",
      link: "https://github.com/noxify/repository",
      siteName: getSiteName("https://github.com/noxify/repository"),
      content: faker.datatype.boolean() ? faker.lorem.paragraphs(3).replace(/\n/gi, "\n\n") : null,
      authorId: faker.helpers.arrayElement(generatedUsers),
      createdAt: new Date(),
    },
  })

  const entryCount = await db.entry.count()

  entryLog.succeed(`Generated ${entryCount} entries`)

  const generalEntries = ([] as number[]).concat(julyGeneral, augustGeneral, [githubRecord.id])
  const askEntries = ([] as number[]).concat(julyAsk, augustAsk)
  const tellEntries = ([] as number[]).concat(julyTell, augustTell)
  const showEntries = ([] as number[]).concat(julyShow, augustShow)

  const allEntries = ([] as number[]).concat(generalEntries, askEntries, tellEntries, showEntries)

  const voteEntryLog = log.spinner("Generate entry votes").start()

  await createEntryVotes({ userIds: generatedUsers, entryIds: allEntries })

  const voteEntryCount = await db.vote.count({ where: { entryId: { not: null } } })
  voteEntryLog.succeed(`Generated ${voteEntryCount} entry votes`)

  const commentLog = log.spinner("Generate comments").start()

  await createComments({
    entryIds: allEntries,
    userIds: generatedUsers,

    levels: 2,
  })
  const commentCount = await db.comment.count()

  commentLog.succeed(`Generated ${commentCount} comments`)

  const voteCommentLog = log.spinner("Generate comment votes").start()

  const allComments = (await db.comment.findMany({ select: { id: true } })).map((ele) => ele.id)
  await createCommentVotes({ userIds: generatedUsers, commentIds: allComments })

  const voteCommentCount = await db.vote.count({ where: { commentId: { not: null } } })
  voteCommentLog.succeed(`Generated ${voteCommentCount} comment votes`)
}

const createEntries = async ({
  type,
  amount,
  from,
  to,
  userIds,
}: {
  type: string
  amount: number
  from: Date | string
  to: Date | string
  userIds: number[]
}): Promise<number[]> => {
  const recordIds: number[] = []

  for (let count = 0; count < amount; count++) {
    const urlPath = faker.datatype.boolean()
      ? faker.random
          .words(faker.datatype.number({ min: 1, max: 6 }))
          .replace(/ /g, "/")
          .toLowerCase()
      : ""

    const link = faker.datatype.boolean()
      ? `${faker.internet.url()}${faker.datatype.boolean() ? `/${urlPath}` : ""}`
      : null

    const seedRecord = await db.entry.create({
      data: {
        type: type,
        title: faker.lorem.words(faker.datatype.number({ min: 3, max: 10 })),
        link: link,
        siteName: link ? getSiteName(link) : null,
        content: faker.datatype.boolean()
          ? faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 5 }), "\n\n\n\n")
          : null,
        authorId: faker.helpers.arrayElement(userIds),
        createdAt: faker.date.between(from, to),
      },
    })

    recordIds.push(seedRecord.id)
  }

  return recordIds
}

const createComments = async ({
  entryIds,
  userIds,
  levels,
}: {
  entryIds: number[]
  userIds: number[]
  levels: number
}) => {
  await db.comment.createMany({
    data: faker.helpers
      .arrayElements(entryIds, faker.datatype.number({ min: 1, max: entryIds.length }))
      .flatMap((ele) => {
        return faker.helpers
          .arrayElements(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            faker.datatype.number({ min: 1, max: 10 })
          )
          .flatMap((val) => {
            return {
              entryId: ele,
              authorId: faker.helpers.arrayElement(userIds),
              content: faker.lorem.paragraphs(
                faker.datatype.number({ min: 1, max: 5 }),
                "\n\n\n\n"
              ),
              parentId: null,
            }
          })
      }),
    skipDuplicates: true,
  })

  const generatedComments = await db.comment.findMany({ select: { id: true, entryId: true } })

  await createCommentReplies({ comments: generatedComments, userIds, levels, currentLevel: 0 })
}

const createCommentReplies = async ({
  comments,
  userIds,
  levels,
  currentLevel,
  parentComment,
}: {
  comments: { id: number; entryId: number }[]
  userIds: number[]
  levels: number
  currentLevel: number
  parentComment?: { id: number; entryId: number }
}) => {
  if (currentLevel <= levels) {
    if (currentLevel == 0) {
      currentLevel++

      for (const comment of comments) {
        const createdReply = await db.comment.create({
          data: {
            entryId: comment.entryId,
            authorId: faker.helpers.arrayElement(userIds),
            content: faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 5 }), "\n\n"),
            parentId: comment.id,
          },
          select: {
            id: true,
            entryId: true,
          },
        })

        await createCommentReplies({
          comments,
          userIds,
          levels,
          currentLevel,
          parentComment: createdReply,
        })
      }
    } else {
      currentLevel++

      for (let i = 0; i < faker.datatype.number({ min: 0, max: 10 }); i++) {
        const createdReply = await db.comment.create({
          data: {
            entryId: parentComment?.entryId as number,
            authorId: faker.helpers.arrayElement(userIds),
            content: faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 5 }), "\n\n"),
            parentId: parentComment?.id as number,
          },
          select: {
            id: true,
            entryId: true,
          },
        })

        await createCommentReplies({
          comments,
          userIds,
          levels,
          currentLevel,
          parentComment: createdReply,
        })
      }
    }
  }
}

const createEntryVotes = async ({
  userIds,
  entryIds,
}: {
  userIds: number[]
  entryIds: number[]
}) => {
  await db.vote.createMany({
    data: faker.helpers
      .arrayElements(entryIds, faker.datatype.number({ min: 1, max: entryIds.length }))
      .flatMap((ele) => {
        const randomUsers = faker.helpers.arrayElements(
          userIds,
          faker.datatype.number({ min: 1, max: userIds.length })
        )

        return randomUsers.flatMap((user) => {
          return { entryId: ele, userId: user }
        })
      }),
    skipDuplicates: true,
  })
}

const createCommentVotes = async ({
  userIds,
  commentIds,
}: {
  userIds: number[]
  commentIds: number[]
}) => {
  await db.vote.createMany({
    data: faker.helpers
      .arrayElements(commentIds, faker.datatype.number({ min: 1, max: commentIds.length }))
      .flatMap((ele) => {
        const randomUsers = faker.helpers.arrayElements(
          userIds,
          faker.datatype.number({ min: 1, max: 20 })
        )

        return randomUsers.flatMap((user) => {
          return { commentId: ele, userId: user }
        })
      }),
    skipDuplicates: true,
  })
}

export default seed
