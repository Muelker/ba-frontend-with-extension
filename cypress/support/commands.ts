/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import { Project } from "./types";

Cypress.Commands.add('login', (name, password) => {
    cy.visit('http://localhost:4200');
    cy.get('[data-cy="login-name-input"]').clear('1');
    cy.get('[data-cy="login-name-input"]').type('123');
    cy.get('[data-cy="login-password-input"]').clear('1');
    cy.get('[data-cy="login-password-input"]').type('123');
    cy.get('[data-cy="login-submit"]').click();
 })


  Cypress.Commands.add('deleteAllProjects', (token: string) => {
    cy.request({
      method: 'GET',
      url: 'http://192.168.50.156:8081/store/projects' ,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      const projects: Project[] = response.body;
      projects.forEach(project => {
        cy.request({
          method: 'DELETE',
          url: `http://192.168.50.156:8081/store/projects/${project.id}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      });
    });
  });

  Cypress.Commands.add('getAccessToken', () => {
    return cy.request({
      method: 'POST',
      url: 'http://192.168.50.156:8081/auth/jwt/create',
      body: {
        username: '123',
        password: '123'
      }
    }).then(response => {
      return response.body.access;
    });
  });

  Cypress.Commands.add('createProject', (name, description, ai_model, token) => {
    cy.request({
      method: 'POST',
      url: 'http://192.168.50.156:8081/store/projects',
      body: {
        name: name,
        description: description,
        ai_model_id: ai_model
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
    });
  });

  declare global {
       namespace Cypress {
         interface Chainable {
           login(email: string, password: string): Chainable<void>
           deleteAllProjects(token: string): Chainable<void>
           getAccessToken(): Chainable<string>
           createProject(name: string, description: string, ai_model: number, token: string): Chainable<void>
           uploadImage(token: string): Chainable<void>
         }
        }
  }
  