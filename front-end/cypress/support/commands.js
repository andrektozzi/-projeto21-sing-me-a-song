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

Cypress.Commands.add("downvoteRecommendation", (recommendation, score) => {
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
      if (score === "less") {
        cy.request(
          "POST",
          "http://localhost:4000/e2e/recommendations/updatescore",
          { name: recommendation.name, score: -5 }
        ).then(() => {
          cy.intercept("POST", `/recommendations/${res.body.id}/downvote`).as(
            "downvoteRecommendation"
          );
        });
      } else {
        cy.intercept("POST", `/recommendations/${res.body.id}/downvote`).as(
          "downvoteRecommendation"
        );
      }

      cy.get('[data-test-id="downvote"]').click();

      cy.wait("@downvoteRecommendation");

      cy.wrap(res.body.score);
    });
  });
});

Cypress.Commands.add("viewRecommendations", () => {
  cy.visit("http://localhost:3000/");

  cy.request(
    "POST",
    "http://localhost:4000/e2e/recommendations/createlist",
    {}
  ).then(() => {
    cy.get('[data-test-id="recommendation"]').should(
      "have.length.lessThan",
      11
    );
  });
});

Cypress.Commands.add("viewRandom", () => {
  cy.visit("http://localhost:3000/");

  cy.request(
    "POST",
    "http://localhost:4000/e2e/recommendations/createlist",
    {}
  ).then(() => {
    cy.get("[data-test-id='random']").click();

    cy.url().should("equal", "http://localhost:3000/random");

    cy.get('[data-test-id="recommendation"]').should("have.length", 1);
  });
});

Cypress.Commands.add("viewTop", () => {
  cy.visit("http://localhost:3000/");
  
  cy.request(
    "POST",
    "http://localhost:4000/e2e/recommendations/createlist",
    {}
  ).then(() => {
    cy.get("[data-test-id='top']").click();

    cy.url().should("equal", `http://localhost:3000/top`);

    cy.get('[data-test-id="recommendation"]').should("have.length", 10);
  });
});
  
Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "http://localhost:4000/e2e/reset", {});
});