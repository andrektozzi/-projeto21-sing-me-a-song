import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import musicDataFactory from "./factories/recommendationDataFactory";

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