import { faker } from '@faker-js/faker';
const randomTitle = faker.lorem.word();
const randomDescription = faker.lorem.words();

describe('Issue deleting', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('You can use rich text with images in issue description').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
      });
    });

  it('Should delete the issue and not displayed in Jira anymore', () => {
   
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.contains('button','Delete issue').click();

    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    cy.reload();

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '3');
            
        cy.get('[data-testid="list-issue"]')
            .contains('You can use rich text with images in issue description').should('not.exist');            
      });
    });

   it('Should cancel deleting and confirm that it is visible in Jira', () => {
   
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.contains('button','Cancel').click();

    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    cy.get('[data-testid="icon:close"]').eq(0).click();

    cy.reload();

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '4');
        cy.get('[data-testid="list-issue"]')    
            .contains('You can use rich text with images in issue description').should('be.visible')
      });
    });  
});