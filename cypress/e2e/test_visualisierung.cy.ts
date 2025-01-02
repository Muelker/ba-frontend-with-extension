describe('visualisation tests', () => {
    it('show_visualization', function() {
      /* ==== Generated with Cypress Studio ==== */
      cy.getAccessToken().then(token => {
          cy.deleteAllProjects(token);
          cy.createProject('Test', 'Test Beschreibung', 1, token);
        });
      cy.login('123','123');
      cy.get('[data-cy="projectlist-project-name"]').click();
      cy.get('[data-cy="project-img-upload-input"]').click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/bild_mit_text.png');
      cy.get('[data-cy="project-img-upload-button"]').click();

      /* ==== End Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.wait(1000);
      cy.get('[data-cy="project-visualize-button-no"]').click();
      cy.wait(25000);
      /* ==== End Cypress Studio ==== */

      /* ==== Generated with Cypress Studio ==== */
      cy.get('#mat-tab-label-0-1 > .mdc-tab__content > .mdc-tab__text-label').click();
      cy.get('[data-cy="visualization-gallery-img"]').click();
      /* ==== End Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.get(':nth-child(1) > .mdc-list-item__content > [data-cy="visualization-overlay-text"]').click();
      cy.get('.selected-overlay').should('have.class', 'selected-overlay');
      /* ==== End Cypress Studio ==== */
    });

    it('change_visualization', function() {
      /* ==== Generated with Cypress Studio ==== */
      cy.getAccessToken().then(token => {
          cy.deleteAllProjects(token);
          cy.createProject('Test', 'Test Beschreibung', 1, token);
        });
      cy.login('123','123');
      cy.get('[data-cy="projectlist-project-name"]').click();
      cy.get('[data-cy="project-img-upload-input"]').click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/bild_mit_text.png');
      cy.get('[data-cy="project-img-upload-button"]').click();

      /* ==== End Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.wait(1000);
      cy.get('[data-cy="project-visualize-button-no"]').click();
      cy.wait(25000);
      /* ==== End Cypress Studio ==== */

      /* ==== Generated with Cypress Studio ==== */
      cy.get('#mat-tab-label-0-1 > .mdc-tab__content > .mdc-tab__text-label').click();
      cy.get('[data-cy="visualization-gallery-img"]').click();
      /* ==== End Cypress Studio ==== */

      /* ==== Generated with Cypress Studio ==== */
      cy.get(':nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > [data-cy="visualization-overlay-change-button"] > .mat-icon').click();
      cy.get('[data-cy="change-Overlays-new-text"]').should('have.value', 'starte');
      cy.get('[data-cy="change-Overlays-new-text"]').clear('z');
      cy.get('[data-cy="change-Overlays-new-text"]').click();
      cy.get('[data-cy="change-overlays-form"]').should('have.class', 'ng-dirty');
      /* ==== End Cypress Studio ==== */
    });
});