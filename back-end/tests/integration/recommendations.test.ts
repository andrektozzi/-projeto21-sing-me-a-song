import app from "../../src/app";
import supertest from "supertest";
import { prisma } from "../../src/database";
import musicFactory from "./factories/musicFactory";
import musicDataFactory from "./factories/musicDataFactory"

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("Test POST /recommendations", () => {
    it("Deve retornar status 200 se a recomendação estiver correta", async () => {
      const music = await musicDataFactory();
      const result = await supertest(app).post(`/recommendations`).send(music);

      const createdMusic = await prisma.recommendation.findFirst({
        where: { name: music.name },
      });

      expect(result.status).toBe(201);
      expect(createdMusic).toBeInstanceOf(Object);
    });
  
    it("Deve retornar status 409 se já existir a recomendação cadastrada", async () => {
      const music = await musicDataFactory();

      await supertest(app).post(`/recommendations`).send(music);
      const result = await supertest(app).post(`/recommendations`).send(music);

      expect(result.status).toBe(409);
    });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Deve retornar status 200 se votar na recomendação corretamente", async () => {
    const createdMusic = await musicFactory();

    const result = await supertest(app).post(`/recommendations/${createdMusic.id}/upvote`).send();

    expect(result.status).toBe(200);
  });

  it("Deve retornar status 404 se votar em uma recomendação que não existe", async () => {
    const result = await supertest(app).post(`/recommendations/${0}/upvote`).send();

    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
    await prisma.$disconnect();
});