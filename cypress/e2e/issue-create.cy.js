import { faker } from '@faker-js/faker';
const randomTitle = faker.lorem.word();
const randomDescription = faker.lorem.words();

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').click();
      //slow down test to get correct choice
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');

      //Select Lord Gaben from (reporter)? dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      //in this case it will be checked from all list of issues where located avatar or icon what we need!!!
      //cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      //cy.get('[data-testid="icon:story"]').should('be.visible');
      cy.get('[data-testid="list-issue"]')
        .first().find('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="list-issue"]')
        .first().find('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
  // new test case 1
  it('Should create an issue with special data and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').click();
      //slow down test to get correct choice
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .trigger('click');
      cy.get('.ql-editor').type('My bug description');
      cy.get('input[name="title"]').type('Bug');
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('Bug');
      cy.get('[data-testid="list-issue"]')
        .first().find('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  //New test case 2
  it('Should create an issue with random data in title and description and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      cy.get('[data-testid="select-option:Task"]').click();
      //slow down test to get correct choice    
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      cy.get('[data-testid="select-option:Task"]')
        .trigger('click');
      cy.get('.ql-editor').type(randomDescription);
      cy.get('input[name="title"]').type(randomTitle);
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(randomTitle);
      //Assert that correct type icon are visible
      cy.get('[data-testid="list-issue"]')
        .first().find('[data-testid="icon:task"]').should('be.visible');
    });
  });
  it.only('Should create an issue with multiple spaces betwwen words in title and validate it successfully', () => {
    const title = ' Hello world ';
    const trimmedTitle = title.trim();
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      cy.get('[data-testid="select-option:Bug"]').click();
      //slow down test to get correct choice    
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .trigger('click');
      cy.get('.ql-editor').type(randomDescription);
      cy.get('input[name="title"]').type(title);
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();
      cy.get('button[type="submit"]').click();
    });
    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(trimmedTitle);
      //Assert that correct type icon are visible
      cy.get('[data-testid="list-issue"]')
        .first().find('[data-testid="icon:bug"]').should('be.visible');
    });
  });
});