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

describe("Test POST /recommendations/:id/downvote", () => {
  it("Deve retornar status 200 se votar na recomendação corretamente com score maior que -5", async () => {
    const createdMusic = await musicFactory();

    const result = await supertest(app).post(`/recommendations/${createdMusic.id}/downvote`).send();

    expect(result.status).toBe(200);
  });

  it("Deve retornar status 200 se votar na recomendação corretamente com score menor que -5", async () => {
    const createdMusic = await musicFactory();

    await prisma.recommendation.update({
      where: { name: createdMusic.name },
      data: {
        score: -5,
      },
    });

    const result = await supertest(app).post(`/recommendations/${createdMusic.id}/downvote`).send();

    const findMusic = await prisma.recommendation.findFirst({
      where: { name: createdMusic.name },
    });

    expect(result.status).toBe(200);
    expect(findMusic).toBeNull();
  });

  it("Deve retornar status 404 se votar em uma recomendação que não existe", async () => {
    const result = await supertest(app).post(`/recommendations/${0}/downvote`).send();

    expect(result.status).toBe(404);
  });
});

describe("Test GET /recommendations", () => {
  it("Deve retornar status 200 se visualizar as recomendações corretamente", async () => {
    let count = 0;
    while (count < 13) {
      await musicFactory();
      count++;
    }

    const result = await supertest(app).get(`/recommendations`);
    const resultLength = result.body.length;

    expect(result.status).toBe(200);
    expect(resultLength).toBeLessThan(11);
    expect(result.body).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/:id", () => {
  it("Deve retornar status 200 se visualizar a recomendação pelo id corretamente", async () => {
    const createdMusic = await musicFactory();

    const result = await supertest(app).get(`/recommendations/${createdMusic.id}`).send();

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject(createdMusic);
  });

  it("Deve retornar status 404 se a recomendação não existir", async () => {
    const result = await supertest(app).get(`/recommendations/${0}`).send();

    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
    await prisma.$disconnect();
});