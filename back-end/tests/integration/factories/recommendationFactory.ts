import { faker } from "@faker-js/faker";
import { prisma } from "../../../src/database";
import musicDataFactory from "./recommendationDataFactory";

export default async function musicFactory() {
  const music = await musicDataFactory();
  await prisma.recommendation.create({
    data: {
      ...music,
    },
  });

  await prisma.recommendation.update({
    where: { name: music.name },
    data: {
      score: faker.datatype.number({ min: -5, max: 300 }),
    },
  });

  return await prisma.recommendation.findFirst({
    where: { name: music.name },
  });
}

