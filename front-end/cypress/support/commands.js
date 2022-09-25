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
    cy.log(recommendation);
  
    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      recommendation.youtubeLink
    );
  
    cy.intercept("POST", "/recommendations").as("createRecommendation");
  
    cy.get("button").click();
  
    cy.wait("@createRecommendation");
});
  
Cypress.Commands.add("resetDatabase", () => {
    cy.request("POST", "http://localhost:4000/e2e/reset", {});
});