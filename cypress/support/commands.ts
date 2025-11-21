/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(type: 'bun' | 'main' | 'sauce'): Chainable<void>
      login(): Chainable<void>
    }
  }
}

Cypress.Commands.add('addIngredient', (type: 'bun' | 'main' | 'sauce') => {
  cy.get(`[data-testid=ingredient-${type}]`).first().within(() => {
    cy.get('button').contains('Добавить').click();
  });
});

Cypress.Commands.add('login', () => {
  window.localStorage.setItem('refreshToken', 'test-refresh-token');
  document.cookie = 'accessToken=test-access-token; path=/';
});

export {};