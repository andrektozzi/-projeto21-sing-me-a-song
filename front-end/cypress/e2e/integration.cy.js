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

describe("Downvote recommendation", () => {
  it("Testa se vota na recomendação com score maior que -5 corretamente", () => {
    const recommendation = createRecommendationDataFactory();

    cy.downvoteRecommendation(recommendation, "greater").then((el) => {
      cy.get('[data-test-id="score"]').should("contain.text", `${el + 1}`);
    });
  });

  it("Testa se vota na recomendação com score maior que -5 corretamente", () => {
    const recommendation = createRecommendationDataFactory();

    cy.downvoteRecommendation(recommendation, "less").then(() => {
      cy.contains('[data-test-id="score"]').should("not.exist");
    });
  });
});

describe("View home", () => {
  it("Testa se visualiza a quantidade correta de recomendações", () => {
    cy.viewRecommendations();
  });
});

describe("View random", () => {
  it("Testa se visualiza a quantidade correta de recomendações random", () => {
    cy.viewRandom();
  });
});

describe("View top", () => {
  it("Testa se visualiza a quantidade correta de recomendações top", () => {
    cy.viewTop();
  });
});