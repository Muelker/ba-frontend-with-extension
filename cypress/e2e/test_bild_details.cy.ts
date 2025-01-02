describe('Bild details tests', () => {
    it('check_bild_details', function() {
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
      cy.get('#mat-tab-label-0-2 > .mdc-tab__content > .mdc-tab__text-label').click();
      cy.get('.thumbnail > [data-cy="canvas-gallery"]').click();
      cy.get('[data-cy="image-details-selected-img"]').should('be.visible');
      cy.get('[data-cy="project-name"]').should('have.text', 'bild_mit_text.png');
      cy.get('[data-cy="image-details-notes"]').should('have.text', 'Notizen werden noch nicht unterstützt!');
      /* ==== End Cypress Studio ==== */
    });

    it('check_bild_details_change_name', function() {
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
      cy.get('#mat-tab-label-0-2 > .mdc-tab__content').click();
      cy.get('.thumbnail > [data-cy="canvas-gallery"]').click();
      cy.wait(1000);
      cy.get('[data-cy="project-details-button-name-edit"] > .mat-mdc-button-touch-target').click({ multiple: true });
      cy.get('[data-cy="edit-image-name-name-input"]').should('have.value', 'bild_mit_text.png');
      cy.get('[data-cy="edit-image-name-form"] > .marg > .mdc-button__label').should('have.text', 'Speichern');
      /* ==== End Cypress Studio ==== */
    });

      it('check_bild_details_change_notes', function() {
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
        cy.get('#mat-tab-label-0-2 > .mdc-tab__content > .mdc-tab__text-label').click();
        cy.get('.thumbnail > [data-cy="canvas-gallery"]').click();
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="project-ditails-button-discription-edit"] > .mat-mdc-button-touch-target').click({ multiple: true });
        cy.get('[data-cy="edit-image-notes-form"]').should('have.text', 'Neue NotizenSpeichern');
        /* ==== End Cypress Studio ==== */
      });
});