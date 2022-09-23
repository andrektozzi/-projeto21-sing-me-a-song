import musicFactory from "./recommendationFactory";

export default async function musicListFactory() {
  let count = 0;
  while (count < 15) {
    await musicFactory();
    count++;
  }

  return;
}