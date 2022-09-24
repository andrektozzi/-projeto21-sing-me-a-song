import recommendationFactory from "./recommendationFactory";

export default async function recommendationListFactory() {
  let count = 0;
  while (count < 13) {
    await recommendationFactory();
    count++;
  }

  return;
}