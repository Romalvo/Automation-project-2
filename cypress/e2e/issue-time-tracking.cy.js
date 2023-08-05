const IssueTitle = ('Romalvo')
describe('Issue time tracking', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            //Create new issue for testing time tracking
            cy.get('[data-testid="modal:issue-create"]').within(() => {
                cy.get('[data-testid="select:type"]').click();
                cy.get('[data-testid="select-option:Story"]').click();
                cy.get('.ql-editor').type('My Story description');
                cy.get('input[name="title"]').type(IssueTitle);
                cy.get('[data-testid="select:reporterId"]').click();
                cy.get('[data-testid="select-option:Pickle Rick"]').click();
                cy.get('[data-testid="select:priority"]').click();
                cy.get('[data-testid="select-option:Highest"]').click();
                cy.get('button[type="submit"]').click();
            });
            cy.get('[data-testid="board-list:backlog"]').should("be.visible").contains(IssueTitle).click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const getTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
    const Stopwatch = ('[data-testid="icon:stopwatch"]');
    const buttonClose = ('[data-testid="icon:close"]');
    const backloglist = ('[data-testid="board-list:backlog"]');
    let TimeEnter = ('input[placeholder="Number"]');

    it('Should add,update and remove estimation time to issue', () => {
        //add estimation time to issue
        getIssueDetailsModal().within(() => {
            cy.contains('No time logged').should('be.visible');
            cy.get(TimeEnter).type(10);
            cy.get(buttonClose).click();
        });
        cy.get(backloglist).contains(IssueTitle).click();
        cy.get(TimeEnter).should("have.value", 10);
        cy.contains('10h estimated').should('be.visible');
        //Update estimation time to issue 
        cy.get(TimeEnter).clear();
        cy.get(TimeEnter).type(20);
        cy.get(buttonClose).click();
        cy.get(backloglist).contains(IssueTitle).click();
        cy.get(TimeEnter).should("have.value", 20);
        cy.contains('20h estimated').should('be.visible');
        //remove estimation time to issue.
        cy.get(TimeEnter).clear();
        cy.get(buttonClose).click();
        cy.get(backloglist).contains(IssueTitle).click();
        cy.contains('No time logged').should('be.visible');
        cy.contains('20h estimated').should('not.exist');
    });

    it('Time logging and removing functionality', () => {
        //add estimation time to issue
        getIssueDetailsModal().within(() => {
            cy.get(Stopwatch).click();
        });
        getTrackingModal()
            .should('be.visible')
            .within(() => {
                cy.get(TimeEnter).first().type(2);
                cy.get(TimeEnter).last().type(5);
                cy.contains('button', 'Done').click();
            });

        cy.contains('No time logged').should('not.exist');
        cy.contains('2h logged').should('be.visible');
        cy.contains('5h remaining').should('be.visible');

        //delete time tracking data
        cy.get(Stopwatch).click();
        getTrackingModal()
            .should('be.visible')
            .within(() => {
                cy.get(TimeEnter).clear();
                cy.get(TimeEnter).clear();
                cy.contains('button', 'Done').click();
            });
        //assert that time time tracking data not visible
        cy.contains('2h logged').should('not.exist');
        cy.contains('5h remaining').should('not.exist');
        cy.contains('No time logged').should('be.visible');
        cy.get(buttonClose).click();
    });
});