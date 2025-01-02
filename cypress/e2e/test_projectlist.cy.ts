describe('projectlist tests', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('projectlist_toggle', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.getAccessToken().then(token => {
      cy.deleteAllProjects(token);
    }); 
    cy.login('123', '123');

    cy.get('.mdc-button__label').should('be.visible');
    cy.get('[data-cy="header-toggle-projectlist"]').click();
    cy.get('.mdc-button__label').should('not.exist');
    cy.get('[data-cy="header-toggle-projectlist"]').click();
    cy.get('.mdc-button__label').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('create-project', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.login('123', '123');
    cy.get('.mdc-button__label').click();
    cy.get('[data-cy="create-project-name"]').clear('T');
    cy.get('[data-cy="create-project-name"]').type('Test');
    cy.get('[data-cy="create-project-description"]').click();
    cy.get('[data-cy="create-project-description"]').type('Test Beschreibung');
    cy.get('[data-cy="create-project-select"]').click();
    cy.get('.mat-mdc-option-active > .mdc-list-item__primary-text').click();
    cy.get('[data-cy="create-project-description"]').click();
    cy.get('[data-cy="create-project-save-button"]').click();
    cy.get('[data-cy="projectlist-project-description"]').should('have.text', 'Test Beschreibung ');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('click_project', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.getAccessToken().then(token => {
      cy.deleteAllProjects(token);
      cy.createProject('Test', 'Test Beschreibung', 1, token);
    });
    cy.login('123', '123');
    cy.get('h1').should('be.visible');
    cy.get('[data-cy="projectlist-project-name"]').click();
    cy.get('[data-cy="project-name-lable"]').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('delete_project', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.getAccessToken().then(token => {
      cy.deleteAllProjects(token);
      cy.createProject('Test', 'Test Beschreibung', 1, token);
    }); 
    cy.login('123', '123');
    cy.get('[data-cy="projectlist-project-delete"]').click();
    cy.get('[data-cy="delete-project-button-yes"]').click();
    /* ==== End Cypress Studio ==== */
  });

  it('search_bar', function() {
    cy.getAccessToken().then(token => {
      cy.deleteAllProjects(token);
      cy.createProject('Test1', 'Test Beschreibung x', 1, token);
      cy.createProject('Test2', 'Test Beschreibung xy', 1, token);
      cy.createProject('Test3', 'Test Beschreibung', 1, token);
      cy.createProject('Testx', 'Test Beschreibung', 1, token);

    }); 
    cy.login('123', '123');

    cy.get('[data-cy="projectlist-searchbar-input"]').click();
    cy.get('[data-cy="projectlist-searchbar-input"]').type('x');
    cy.get('[data-cy="projectlist-searchbar-input"]').type('y');
    cy.get('[data-cy="projectlist-searchbar-input"]').type('z');
    cy.get('[data-cy="projectlist-project-name"]').should('not.exist');
    cy.get('[data-cy="projectlist-searchbar-button-search"]').click();
    cy.get('[data-cy="projectlist-project-name"]').should('be.visible');

  });
});

