import { prisma } from "../../../src/database";
import musicDataFactory from "../factories/musicDataFactory";

export default async function musicFactory() {
  const music = await musicDataFactory();
  await prisma.recommendation.create({
    data: {
      ...music,
    },
  });

  return await prisma.recommendation.findFirst({
    where: { name: music.name },
  });
}