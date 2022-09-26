import * as e2eRepository from "../repositories/e2eRepository.js";
import { faker } from "@faker-js/faker";

export async function truncate() {
  await e2eRepository.truncate();
}

export async function getByName(name: string) {
  return await e2eRepository.findByName(name);
}

export async function updateScore(name: string, score: number) {
  return await e2eRepository.updateScore(name, score);
}

export async function createList() {
  for (let i = 0; i < 15; i++) {
    const fakerString = faker.random.alpha(11);

    const recommendation = {
      name: faker.lorem.words(),
      youtubeLink: `https://youtu.be/${fakerString}`
    }
    let score = faker.datatype.number({ min: -5, max: 20 });
    await e2eRepository.create(recommendation.name, recommendation.youtubeLink);
    await updateScore(recommendation.name, score);
  }
  return;
}