import recommendationDataFactory from "./recommendationDataFactory";

export default async function recommendationListFactory() {
  let count = 0;
  let musicList = [];

  while (count < 10) {
    const music = await recommendationDataFactory();
    music.id = count + 1;

    musicList.push(music);
    count++;
  }

  return musicList;
}