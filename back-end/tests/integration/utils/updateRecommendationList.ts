import { prisma } from "../../../src/database";

export default async function updateRecommendationList(value: number) {
  return await prisma.recommendation.updateMany({
    where: {
      youtubeLink: {
        contains: "https://youtu.be",
      },
    },
    data: {
      score: value,
    }
  });
}