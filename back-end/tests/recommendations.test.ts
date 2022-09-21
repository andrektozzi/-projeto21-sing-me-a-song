import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe("Test POST /recommendations", () => {
    it("Deve retornar status 200 se a recomendação estiver correta", async () => {
      const music = await recommendationFactory();
      const result = await supertest(app).post(`/recommendations`).send(music);
  
      const createdMusic = await prisma.recommendation.findFirst({
        where: { name: music.name },
      });
  
      expect(result.status).toBe(201);
      expect(createdMusic).toBeInstanceOf(Object);
    });
  
    it("Deve retornar status 409 se já existir a recomendação cadastrada", async () => {
      const music = await recommendationFactory();
  
      await supertest(app).post(`/recommendations`).send(music);
      const result = await supertest(app).post(`/recommendations`).send(music);
  
      expect(result.status).toBe(409);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});