import { faker } from "@faker-js/faker";

export default async function recommendationDataFactory() {
  const fakerString = faker.random.alpha(11);
  return {
    id: 1,
    name: faker.music.songName(),
    youtubeLink: `https://youtu.be/${fakerString}`,
    score: faker.datatype.number({ min: -5, max: 20 }),
  };
}