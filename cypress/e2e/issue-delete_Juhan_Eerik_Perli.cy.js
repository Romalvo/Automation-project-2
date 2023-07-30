describe("Issue deletion tests", () => {
  const issueTitle = "This is an issue of type: Task.";
  const issueDetails = '[data-testid="modal:issue-details"]';
  const modalConfirm = '[data-testid="modal:confirm"]';
  const iconTrash = '[data-testid="icon:trash"]';

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Test 1: Delete an issue", () => {
    // Deleting an issue by clicking "Trash button"
    cy.get(iconTrash).click();
    // Confirming that Deletion modal is visible and confirming a deletion
    cy.get(modalConfirm).should("be.visible");
    cy.get(modalConfirm).contains("button", "Delete issue").click();
    // Assert that deletion confirmation dialogue doesn't exist
    cy.get(modalConfirm).should("not.exist");
    // Assert that issue is deleted and not displayed on the Jira board anymore
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list now contains 3 issues and first element with tag p does not contain issueTitle text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "3")
          .first()
          .find("p")
          .should("not.have.text", issueTitle);
      });
  });

  it("Test 2: Cancel deleting process", () => {
    cy.get(iconTrash).click();
    // Confirming that Deletion modal is visible and canceling deleting
    cy.get(modalConfirm).should("be.visible");
    cy.get(modalConfirm).contains("button", "Cancel").click();
    // Checking that Deletion modal is closed
    cy.get(modalConfirm).should("not.exist");
    // Close the Editing modal
    cy.get(issueDetails).within(() => {
      cy.get('[data-testid="icon:close"]')
        // Select first "X" button and click on it
        .first()
        .click();
    });
    // Assert that issue is NOT deleted and is still displayed on the Jira board
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Assert that this list now contains 4 issues and first element with tag p has issueTitle taxt
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "4")
          .first()
          .find("p")
          .should("have.text", issueTitle);
      });
  });
});
