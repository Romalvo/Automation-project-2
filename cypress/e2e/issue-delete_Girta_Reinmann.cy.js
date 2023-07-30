/* ASSIGNMENT 3:
TEST 1: 
Create a new test case for deleting issue:
    - add the step for opening first issue from the board already to beforeEach() block;
    - assert, that issue detail view modal is visible. This step can be also added to beforeEach block;
    - delete issue (click delete button and confirm deletion);
    - assert, that deletion confirmation dialogue is not visible;
    - assert, that issue is deleted and not displayed on the Jira board anymore */

const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]')

describe('Deleting an issue and cancel deletion', () => {
    // Variable declaration
    let firstTitle

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.get('[data-testid="board-list:backlog"]')
                .should('be.visible')
                .first()
                .click()
                .then(($title) => {
                    // Saving the title of the first item to a variable
                    firstTitle = $title.text()
                    getIssueDetailsModal()
                        .should('be.visible')
                });
        });
    });

    it('Should delete first issue and confirm deletion', () => {
        cy.get('[data-testid="icon:trash"]')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .should('be.visible')
            .contains('button', 'Delete issue')
            .click()
            .should('not.exist');

        cy.get('[data-testid="board-list:backlog"]')
            .should('be.visible');

        cy.get('[data-testid="modal:issue-details"]')
            .should('not.exist');

        cy.reload();

        cy.get('[data-testid="list-issue"]')
            .should('not.contain', firstTitle);
    });

/* 
TEST 2: 
Create new test case for starting the deleting issue process, but cancelling this action:
    - create new test case to the same test spec file. The same beforeEach() block will be used;
    - assert, that issue detail view modal is visible;
    - click delete issue button;
    - cancel the deletion in the confirmation pop-up;
    - assert, that deletion confirmation dialogue is not visible;
    - assert, that issue is not deleted and still displayed on the Jira board */

    it('Should cancel first issue deleting process and confirm that issue is not deleted', () => {
        cy.get('[data-testid="icon:trash"]')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .should('be.visible')
            .contains('button', 'Cancel')
            .click()
            .should('not.exist');

        cy.get('[data-testid="modal:issue-details"]')
            .should('be.visible');

        cy.get('[data-testid="icon:close"]')
            .first()
            .click()

        cy.get('[data-testid="modal:issue-details"]')
            .should('not.exist');

        cy.reload();

        cy.get('[data-testid="board-list:backlog"]')
            .first()
            .then(($title) => {
                cy.contains('[data-testid="board-list:backlog"]', firstTitle)
                    .should('be.visible');
            });
    });
});
