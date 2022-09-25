import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";

beforeEach( () => {
  cy.resetDatabase()
});

describe("Route /", () => {
  it("Testa o usuário se cadastra com sucesso", () => {
    const recommendation = createRecommendationDataFactory();
    cy.createRecommendation(recommendation);
    cy.contains(recommendation.name).should("be.visible");
  });
});