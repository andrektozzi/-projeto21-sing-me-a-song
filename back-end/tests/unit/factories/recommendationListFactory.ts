import { faker } from "@faker-js/faker";

export default async function musicListFactory() {
  let count = 0;
  let musicList = [];

  while (count < 10) {
    const fakerString = faker.random.alpha(11);
    const music = {
      id: count + 1,
      name: faker.music.songName(),
      youtubeLink: `https://youtu.be/${fakerString}`,
      score: faker.datatype.number({ min: -5, max: 300 })
    }

    musicList.push(music);
    count++;
  }

  return musicList;
}