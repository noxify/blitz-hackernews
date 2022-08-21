import db from "db"
import { faker } from "@faker-js/faker"

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

  for (let iJulyGeneral = 0; iJulyGeneral < 1000; iJulyGeneral++) {
    const urlPath = faker.datatype.boolean()
      ? faker.random
          .words(faker.datatype.number({ min: 1, max: 6 }))
          .replace(/ /g, "/")
          .toLowerCase()
      : ""

    const withLink = faker.datatype.boolean()
    const seedRecord = await db.entry.create({
      data: {
        type: "general",
        title: faker.lorem.words(faker.datatype.number({ min: 3, max: 10 })),
        link: faker.datatype.boolean()
          ? `${faker.internet.url()}${faker.datatype.boolean() ? urlPath : ""}`
          : null,
        content: faker.datatype.boolean()
          ? faker.lorem.paragraphs(3).replace(/\n/gi, "\n\n")
          : null,
        authorId: faker.helpers.arrayElement(generatedUsers),
        createdAt: faker.date.between("2020-07-01T00:00:00.000Z", "2022-08-01T00:00:00.000Z"),
      },
    })

    generatedGeneral.push(seedRecord.id)
  }

  for (let iAugustGeneral = 0; iAugustGeneral < 1000; iAugustGeneral++) {
    const urlPath = faker.datatype.boolean()
      ? faker.random
          .words(faker.datatype.number({ min: 1, max: 6 }))
          .replace(/ /g, "/")
          .toLowerCase()
      : ""

    const withLink = faker.datatype.boolean()
    const seedRecord = await db.entry.create({
      data: {
        type: "general",
        title: faker.lorem.words(faker.datatype.number({ min: 3, max: 10 })),
        link: faker.datatype.boolean()
          ? `${faker.internet.url()}${faker.datatype.boolean() ? urlPath : ""}`
          : null,
        content: faker.datatype.boolean()
          ? faker.lorem.paragraphs(3).replace(/\n/gi, "\n\n")
          : null,
        authorId: faker.helpers.arrayElement(generatedUsers),
        createdAt: faker.date.between("2020-08-01T00:00:00.000Z", "2022-09-01T00:00:00.000Z"),
      },
    })

    generatedGeneral.push(seedRecord.id)
  }
}

export default seed
