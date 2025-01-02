describe('dashboard tests', () => {
    it('check dashboard', function() {
      /* ==== Generated with Cypress Studio ==== */
      cy.getAccessToken().then(token => {
          cy.deleteAllProjects(token);
          cy.createProject('Test1', 'Test Beschreibung 1', 1, token);
          cy.createProject('Test2', 'Test Beschreibung 2', 1, token);
          cy.createProject('Test3', 'Test Beschreibung 3', 1, token);
          cy.createProject('Test4', 'Test Beschreibung 4', 1, token);
        });
      cy.login('123','123');


      /* ==== Generated with Cypress Studio ==== */
      cy.get(':nth-child(2) > .mat-icon').click();
      cy.get('.project-details-table > :nth-child(2) > :nth-child(1)').should('have.text', 'Test1');
      cy.get('.project-details-table > :nth-child(3) > :nth-child(1)').should('have.text', 'Test2');
      cy.get('.project-details-table > :nth-child(4) > :nth-child(1)').should('have.text', 'Test3');
      cy.get('.project-details-table > :nth-child(5) > :nth-child(1)').should('have.text', 'Test4');
      cy.get(':nth-child(5) > :nth-child(5) > [data-cy="project-ditails-button-discription-edit"] > .mat-mdc-button-touch-target').click();
      cy.get('[data-cy="project-name"]').should('have.text', 'Test4');
      /* ==== End Cypress Studio ==== */
    });

});