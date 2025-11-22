/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(type: 'bun' | 'main' | 'sauce'): Chainable<void>
      login(): Chainable<void>
      getIngredient(type: 'bun' | 'main' | 'sauce'): Chainable<JQuery<HTMLElement>>
      getConstructorBun(): Chainable<JQuery<HTMLElement>>
      getConstructorIngredients(): Chainable<JQuery<HTMLElement>>
      getOrderButton(): Chainable<JQuery<HTMLElement>>
      getModal(): Chainable<JQuery<HTMLElement>>
      getModalClose(): Chainable<JQuery<HTMLElement>>
    }
  }
}

export const SELECTORS = {
  ingredient: (type: string) => `[data-testid=ingredient-${type}]`,
  ingredientName: '[data-testid=ingredient-name]',
  constructorBunTop: '[data-testid=constructor-bun-top]',
  constructorBunBottom: '[data-testid=constructor-bun-bottom]',
  constructorIngredients: '[data-testid=constructor-ingredients]',
  constructorIngredient: '[data-testid=constructor-ingredient]',
  orderButton: '[data-testid=order-button]',
  modal: '[data-testid=modal]',
  modalClose: '[data-testid=modal-close]',
  orderNumber: '[data-testid=order-number]'
};

Cypress.Commands.add('addIngredient', (type: 'bun' | 'main' | 'sauce') => {
  cy.getIngredient(type).first().within(() => {
    cy.get('button').contains('Добавить').click();
  });
});

Cypress.Commands.add('login', () => {
  window.localStorage.setItem('refreshToken', 'test-refresh-token');
  document.cookie = 'accessToken=test-access-token; path=/';
});

Cypress.Commands.add('getIngredient', (type: 'bun' | 'main' | 'sauce') => {
  return cy.get(SELECTORS.ingredient(type));
});

Cypress.Commands.add('getConstructorBun', () => {
  return cy.get(SELECTORS.constructorBunTop);
});

Cypress.Commands.add('getConstructorIngredients', () => {
  return cy.get(SELECTORS.constructorIngredients);
});

Cypress.Commands.add('getOrderButton', () => {
  return cy.get(SELECTORS.orderButton);
});

Cypress.Commands.add('getModal', () => {
  return cy.get(SELECTORS.modal);
});

Cypress.Commands.add('getModalClose', () => {
  return cy.get(SELECTORS.modalClose);
});

export {};