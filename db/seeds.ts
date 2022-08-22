import db from "db"
import { faker } from "@faker-js/faker"
import { getSiteName } from "app/helper"

const seed = async () => {
  const generatedUsers: number[] = []
  const generatedGeneral: number[] = []

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

  const julyGeneral = await createEntries({
    type: "general",
    amount: 1000,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustGeneral = await createEntries({
    type: "general",
    amount: 1000,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const julyAsk = await createEntries({
    type: "ask",
    amount: 1000,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustAsk = await createEntries({
    type: "general",
    amount: 1000,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const julyTell = await createEntries({
    type: "tell",
    amount: 1000,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustTell = await createEntries({
    type: "tell",
    amount: 1000,
    from: "2022-08-01T00:00:00.000Z",
    to: "2022-09-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const julyShow = await createEntries({
    type: "show",
    amount: 1000,
    from: "2022-07-01T00:00:00.000Z",
    to: "2022-08-01T00:00:00.000Z",
    userIds: generatedUsers,
  })

  const augustShow = await createEntries({
    type: "show",
    amount: 1000,
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

  const generalEntries = ([] as number[]).concat(julyGeneral, augustGeneral, [githubRecord.id])
  const askEntries = ([] as number[]).concat(julyAsk, augustAsk)
  const tellEntries = ([] as number[]).concat(julyTell, augustTell)
  const showEntries = ([] as number[]).concat(julyShow, augustShow)

  const generalComments = await createComments({
    entryIds: generalEntries,
    userIds: generatedUsers,
    amount: {
      min: 0,
      max: 20,
    },
    levels: 4,
    currentLevel: 0,
  })
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
          ? faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 3 }), "\n\n")
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
  amount,
  levels,
  currentLevel,
  parentId,
  parentEntryId,
}: {
  entryIds: number[]
  userIds: number[]
  amount: {
    min: number
    max: number
  }
  parentId?: number
  levels: number
  currentLevel: number
  parentEntryId?: number
}) => {
  for (let commentCount = 0; commentCount < faker.datatype.number(amount); commentCount++) {
    const entryId = faker.helpers.arrayElement(entryIds)
    const commentRecord = await db.comment.create({
      data: {
        entryId: parentEntryId || entryId,
        authorId: faker.helpers.arrayElement(userIds),
        content: faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 5 }), "\n\n"),
        parentId: parentId,
      },
    })

    if (currentLevel < levels) {
      await createComments({
        entryIds: entryIds,
        userIds: userIds,
        amount: {
          min: 0,
          max: 5,
        },
        levels: levels,
        currentLevel: currentLevel++,
        parentId: commentRecord.id,
        parentEntryId: parentEntryId || entryId,
      })
    }
  }
}

export default seed
