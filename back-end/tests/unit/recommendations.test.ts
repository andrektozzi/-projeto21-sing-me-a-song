import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";
import recommendationDataFactory from "./factories/recommendationDataFactory";
import recommendationListFactory from "./factories/recommendationListFactory";
import { notFoundError } from "../../src/utils/errorUtils";
import filterMusicList from "./utils/filterMusicList";

describe("Test POST /recommendations", () => {
  it("Deve retornar status 200 se postar a recomendação corretamente", async () => {
    const recommendation = await createRecommendationDataFactory();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {});

    jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Deve retornar status 409 se cadastrar uma recomendação que já existe", async () => {
    const recommendation = await createRecommendationDataFactory();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
        return {
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink
        }
      });

    const result = recommendationService.insert(recommendation);
    expect(result).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict"
    });
  });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Deve retornar status 200 se votar na recomendação corretamente", async () => {
    const recommendation = await recommendationDataFactory();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
        return recommendation;
      });

    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});

    await recommendationService.upvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Deve retornar status 404 se votar na recomendação que não existe", async () => {
    const recommendation = await recommendationDataFactory();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(recommendation.id);
    expect(result).rejects.toEqual({
      message: "",
      type: "not_found"
    });
  });
});

describe ("Test POST /recommendations/:id/downvote", () => {
  it("Deve retornar status 200 se votar na recomendação com score maior que -5 corretamente", async () => {
    const recommendation = await recommendationDataFactory();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
        return recommendation;
      });

    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
        return recommendation;
      });

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Deve retornar status 200 se votar na recomendação com score menor que -5 corretamente", async () => {
    const recommendation = await recommendationDataFactory();
    recommendation.score = -6;

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
        return recommendation;
      });

    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
        return recommendation;
      });

    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.remove).toBeCalled();
  });

  it("Deve retornar status 404 se votar em uma recomendação que não existe", async () => {
    const recommendation = await recommendationDataFactory();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});

    const result = recommendationService.downvote(recommendation.id);
    expect(result).rejects.toEqual({
      message: "",
      type: "not_found"
    });
  });
});

describe("Test GET /recommendations", () => {
  it("Deve retornar status 200 se visualizar as recomendações corretamente", async () => {
    const recommendationList = await recommendationListFactory();

    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
        return recommendationList;
      });

    const result = recommendationService.get();
    expect(result).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/top/:amount", () => {
  it("Deve retornar status 200 se visualizar as recomendações corretamente", async () => {
    const musicList = await recommendationListFactory();
    const amount = 3;

    const musicListSorted = musicList.sort((a, b) => {
        return b.score - a.score;
      }).splice(0, amount);

    jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => {
        return musicListSorted;
      });

    const result = recommendationService.getTop(amount);
    expect(result).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/random", () => {
  it("Deve retornar status 200 se visualizar a recomendação com score maior que 10 corretamente", async () => {
    const musicList = await recommendationListFactory();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.4);

    const recommendations = musicList.filter((el: any) => {
      return el.score > 10;
    });

    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
        return recommendations;
      });

    const result = await recommendationService.getRandom();

    expect(result).toBeInstanceOf(Object);
    expect(result.score).toBeGreaterThan(10);
  });

  it("Deve retornar status 200 se visualizar a recomendação com score menor que 10 corretamente", async () => {
    const recommendations = filterMusicList();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);

    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
        return recommendations;
      });

    const result = await recommendationService.getRandom();

    expect(result).toBeInstanceOf(Object);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it("Deve retornar not found se a recomendação não existir", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => []);

    const promise = recommendationService.getRandom();
    expect(promise).rejects.toEqual(notFoundError());
  });
});