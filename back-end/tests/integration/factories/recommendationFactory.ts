import { faker } from "@faker-js/faker";
import { prisma } from "../../../src/database";
import recommendationDataFactory from "./recommendationDataFactory";

export default async function recommendationFactory() {
  const music = await recommendationDataFactory();
  await prisma.recommendation.create({
    data: {
      ...music,
    },
  });

  await prisma.recommendation.update({
    where: { name: music.name },
    data: {
      score: faker.datatype.number({ min: -5, max: 20 }),
    },
  });

  return await prisma.recommendation.findFirst({
    where: { name: music.name },
  });
}

