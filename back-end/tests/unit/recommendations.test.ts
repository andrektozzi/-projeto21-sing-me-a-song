import { jest } from "@jest/globals";
import { rejects } from "assert";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import musicDataFactory from "./factories/recommendationDataFactory";
import musicListFactory from "./factories/recommendationListFactory";

describe("Test POST /recommendations", () => {
    it("Deve retornar status 200 se postar a recomendação corretamente", async () => {
        const music = await musicDataFactory();
    
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {});
    
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => {});
    
        await recommendationService.insert(music);
        expect(recommendationRepository.findByName).toBeCalled();
    });

    it("Should return 409 if registered a recommendation that already exists", async () => {
        const music = await musicDataFactory();
    
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
            return { name: music.name, youtubeLink: music.youtubeLink };
          });
    
        const result = recommendationService.insert(music);
        expect(result).rejects.toEqual({
          message: "Recommendations names must be unique",
          type: "conflict",
        });
    });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Deve retornar status 200 se votar na recomendação corretamente", async () => {
    const music = await musicDataFactory();
    const id = 1;
    
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
      return { id, name: music.name, youtubeLink: music.youtubeLink };
    });
    
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});
    
    await recommendationService.upvote(id);
    
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should return 404 if voting for a recommendation that doesn't exist", async () => {
    await musicDataFactory();
    const id = 1;
    
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});
    
    const result = recommendationService.upvote(id);
    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});