// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("createRecommendation", (recommendation) => {
  cy.visit("http://localhost:3000/");

  cy.get('input[placeholder="Name"]').type(recommendation.name);
  cy.get('input[placeholder="https://youtu.be/..."]').type(
    recommendation.youtubeLink
  );

  cy.intercept("POST", "/recommendations").as("createRecommendation");

  cy.get("[data-test-id='submitButton']").click();

  cy.wait("@createRecommendation");

  cy.contains(recommendation.name).should("be.visible");
});

Cypress.Commands.add("upvoteRecommendation", (recommendation) => {
  cy.visit("http://localhost:3000/");

  cy.request(
    "POST",
    "http://localhost:4000/recommendations",
    recommendation
  ).then(() => {
    cy.request(
      "GET",
      `http://localhost:4000/e2e/recommendations/${recommendation.name}`
    ).then((res) => {
      cy.log(res.body);
      cy.intercept("POST", `/recommendations/${res.body.id}/upvote`).as(
        "upvoteRecommendation"
      );

      cy.get('[data-test-id="upvote"]').click();

      cy.wait("@upvoteRecommendation");

      cy.get('[data-test-id="score"]').should(
        "contain.text",
        `${res.body.score + 1}`
      );
    });
  });
});
  
Cypress.Commands.add("resetDatabase", () => {
    cy.request("POST", "http://localhost:4000/e2e/reset", {});
});