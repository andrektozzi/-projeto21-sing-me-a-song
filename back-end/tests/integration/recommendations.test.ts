import supertest from "supertest";
import { jest } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/database";
import recommendationFactory from "./factories/recommendationFactory";
import recommendationDataFactory from "./factories/recommendationDataFactory";
import recommendationListFactory from "./factories/recommendationListFactory";
import isArraySorted from "./utils/isArraySorted";
import updateRecommendationList from "./utils/updateRecommendationList";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("Test POST /recommendations", () => {
    it("Deve retornar status 200 se a recomendação estiver correta", async () => {
      const recommendation = await recommendationDataFactory();
      const result = await supertest(app).post(`/recommendations`).send(recommendation);

      const createdRecommendation = await prisma.recommendation.findFirst({
        where: { name: recommendation.name },
      });

      expect(result.status).toBe(201);
      expect(createdRecommendation).toBeInstanceOf(Object);
    });
  
    it("Deve retornar status 409 se já existir a recomendação cadastrada", async () => {
      const recommendation = await recommendationDataFactory();

      await supertest(app).post(`/recommendations`).send(recommendation);
      const result = await supertest(app).post(`/recommendations`).send(recommendation);

      expect(result.status).toBe(409);
    });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Deve retornar status 200 se votar na recomendação corretamente", async () => {
    const createdRecommendation = await recommendationFactory();

    const result = await supertest(app).post(`/recommendations/${createdRecommendation.id}/upvote`).send();

    expect(result.status).toBe(200);
  });

  it("Deve retornar status 404 se votar em uma recomendação que não existe", async () => {
    const result = await supertest(app).post(`/recommendations/${0}/upvote`).send();

    expect(result.status).toBe(404);
  });
});

describe("Test POST /recommendations/:id/downvote", () => {
  it("Deve retornar status 200 se votar na recomendação corretamente com score maior que -5", async () => {
    const createdRecommendation = await recommendationFactory();

    const result = await supertest(app).post(`/recommendations/${createdRecommendation.id}/downvote`).send();

    expect(result.status).toBe(200);
  });

  it("Deve retornar status 200 se votar na recomendação corretamente com score menor que -5", async () => {
    const createdRecommendation = await recommendationFactory();

    await prisma.recommendation.update({
      where: { name: createdRecommendation.name },
      data: {
        score: -5,
      }
    });

    const result = await supertest(app).post(`/recommendations/${createdRecommendation.id}/downvote`).send();

    const findMusic = await prisma.recommendation.findFirst({
      where: { name: createdRecommendation.name }
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
    await recommendationListFactory();

    const result = await supertest(app).get(`/recommendations`);
    const resultLength = result.body.length;

    expect(result.status).toBe(200);
    expect(resultLength).toBeLessThan(11);
    expect(result.body).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/:id", () => {
  it("Deve retornar status 200 se visualizar as recomendações corretamente", async () => {
    const createdRecommendation = await recommendationFactory();

    const result = await supertest(app).get(`/recommendations/${createdRecommendation.id}`).send();

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject(createdRecommendation);
  });

  it("Deve retornar status 404 se a recomendação não existe", async () => {
    const result = await supertest(app).get(`/recommendations/${0}`).send();

    expect(result.status).toBe(404);
  });
});

describe("Test GET /recommendations/random", () => {
  it("Deve retornar status 200 se visualizar recomendação com score maior que 10 corretamente", async () => {
    await recommendationListFactory();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.4);

    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body.score).toBeGreaterThan(10);
  });

  it("Deve retornar status 200 se visualizar recomendação com score menor que 10 corretamente", async () => {
    await recommendationListFactory();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);

    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body.score).toBeLessThanOrEqual(10);
  });

  it("Deve retornar somente se existir recomendação com score maior que 10", async () => {
    await recommendationListFactory();
    updateRecommendationList(11);

    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);
    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it("Deve retornar somente se existir recomendação com score menor que 10", async () => {
    await recommendationListFactory();
    updateRecommendationList(1);

    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.4);
    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it("Deve retornar status 404 se a recomendação não existe", async () => {
    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(404);
  });
});

describe("Test GET /recommendations/top/:amount", () => {
  it("Deve retornar status 200 se visualizar as recomendações corretamente", async () => {
    const amount = 20;
    await recommendationListFactory();

    const result = await supertest(app).get(`/recommendations/top/${amount}`);
    const isResultArraySorted = isArraySorted(result.body);

    expect(isResultArraySorted).toBe(true);
    expect(result.body.length).toBeLessThanOrEqual(amount);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
    await prisma.$disconnect();
});