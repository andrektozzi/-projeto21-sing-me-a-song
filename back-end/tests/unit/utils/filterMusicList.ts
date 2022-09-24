import musicListFactory from "../factories/recommendationListFactory";

export default async function filterMusicList() {
  const musicList = await musicListFactory();
  return musicList.filter((el: any) => {
    return el.score < 10;
  });
}