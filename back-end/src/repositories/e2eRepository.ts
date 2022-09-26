import { prisma } from "../database.js";

export async function truncate() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

export function findByName(name: string) {
  return prisma.recommendation.findUnique({
    where: { name },
  });
}

export function updateScore(name: string, score: number) {
  return prisma.recommendation.update({
    where: { name },
    data: {
      score,
    },
  });
}