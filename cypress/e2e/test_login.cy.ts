describe('Login tests', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('login_texts', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200');
    cy.get('[data-cy="login-name-lable"]').should('have.text', 'Username:');
    cy.get('[data-cy="login-password-lable"]').should('have.text', 'Password:');
    cy.get('[data-cy="login-submit"]').should('have.text', 'Anmelden');
    cy.get('[data-cy="login-to-register"]').should('have.text', 'Noch kein Konto?');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('login', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200');
    cy.get('[data-cy="login-name-input"]').clear('1');
    cy.get('[data-cy="login-name-input"]').type('123');
    cy.get('[data-cy="login-password-input"]').clear('1');
    cy.get('[data-cy="login-password-input"]').type('123');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('.logo').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('login_to_register', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200');
    cy.get('[data-cy="login-to-register"]').click();
    cy.get('[data-cy="register-submit"]').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});

