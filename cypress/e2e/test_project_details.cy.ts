describe('projectdetails tests', () => {
    /* ==== Test Created with Cypress Studio ==== */
    it('project_details', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.getAccessToken().then(token => {
        cy.deleteAllProjects(token);
        cy.createProject('Test', 'Test Beschreibung', 1, token);
      });

    cy.login('123', '123');
    
    cy.get('[data-cy="projectlist-project-name"]').click();
    cy.get('[data-cy="project-name"]').should('have.text', 'Test');
    cy.get('[data-cy="project-description"]').should('have.text', 'Test Beschreibung');
    cy.get('[data-cy="project-isvisualized-no"]').should('have.text', 'Nicht visualisiert autorenew Visualisieren ');
    /* ==== End Cypress Studio ==== */
    });

    it('change_name', function() {
      /* ==== Generated with Cypress Studio ==== */
      cy.getAccessToken().then(token => {
          cy.deleteAllProjects(token);
          cy.createProject('Test', 'Test Beschreibung', 1, token);
        });

      cy.login('123', '123');

      cy.get('[data-cy="projectlist-project-name"]').click();
      /* ==== End Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="project-details-button-name-edit"]').click();
     cy.get('[data-cy="edit-name-input"]').clear();
      cy.get('[data-cy="edit-name-input"]').type('Huhu'); 
      cy.get('[data-cy="edit-name-button"]').click();
      cy.get('[data-cy="project-name"]').should('have.text', 'Huhu');
      /* ==== End Cypress Studio ==== */
    });

      it('change_description', function() {
        /* ==== Generated with Cypress Studio ==== */
        cy.getAccessToken().then(token => {
            cy.deleteAllProjects(token);
            cy.createProject('Test', 'Test Beschreibung', 1, token);
          });

        cy.login('123', '123');

        cy.get('[data-cy="projectlist-project-name"]').click();

        /* ==== End Cypress Studio ==== */

        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="project-details-button-discription-edit"] > .mat-mdc-button-touch-target').click();
        cy.get('[data-cy="edit-description-input"]').clear();
        cy.get('[data-cy="edit-description-input"]').type('Neue Beschreibung');
        cy.get('[data-cy="edit-description-button"] > .mdc-button__label').click();
        cy.get('[data-cy="project-description"]').should('have.text', 'Neue Beschreibung');
        /* ==== End Cypress Studio ==== */
      });

    /* ==== Test Created with Cypress Studio ==== */
    it('upload_image', function() {
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
        cy.get('.delete-image-container > img').should('be.visible');
        /* ==== End Cypress Studio ==== */
    });

    it('delete_image', function() {
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

        cy.get('[data-cy="project-gallery-img-delete"]').click();
        cy.get('[data-cy="delete-image-button-yes"]').click();
        cy.get('.delete-image-container > img').should('not.exist');
        /* ==== End Cypress Studio ==== */
    });

    it('visualize', function() {
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
      cy.get('[data-cy="project-visualize-button-no"] > .mdc-button__label').click();
      cy.wait(25000);
      cy.get('[data-cy="project-isvisualized-yes"]').should('have.text', 'Visualisiert autorenew Visualisieren ');
      cy.get('[data-cy="project-img-upload-input"]').click();
      /* ==== End Cypress Studio ==== */
    });

    it('partly_visualize', function() {
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
      cy.get('[data-cy="project-visualize-button-no"] > .mdc-button__label').click();
      cy.wait(25000);
      cy.get('[data-cy="project-isvisualized-yes"]').should('have.text', 'Visualisiert autorenew Visualisieren ');
      cy.get('[data-cy="project-img-upload-input"]').click();
      /* ==== End Cypress Studio ==== */

      cy.get('[data-cy="project-img-upload-input"]').click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/bild_mit_text.png');
      cy.get('[data-cy="project-img-upload-button"]').click();

      cy.get('[data-cy="project-isvisualized-partly"]').should('have.text', 'Teilweise visualisiert autorenew Visualisieren ');
    });
});