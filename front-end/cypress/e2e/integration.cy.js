import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";

beforeEach( () => {
  cy.resetDatabase()
});

describe("Create recommendation", () => {
  it("Testa se a recomendação é cadastrada corretamente", () => {
    const recommendation = createRecommendationDataFactory();
    cy.createRecommendation(recommendation);
  });
});

describe("Upvote recommendation", () => {
  it("Testa se vota na recomendação corretamente", () => {
    const recommendation = createRecommendationDataFactory();
    cy.upvoteRecommendation(recommendation);
  });
});