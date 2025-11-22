import { SELECTORS } from '../support/commands';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    
    cy.login();
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.addIngredient('bun');
      cy.getConstructorBun().should('exist');
      cy.get(SELECTORS.constructorBunBottom).should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.addIngredient('main');
      cy.getConstructorIngredients().should('exist');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      cy.getIngredient('main').first().click();
      cy.url().should('include', '/ingredients/');
    });

    it('должен закрывать модальное окно при клике на крестик', () => {
      cy.getIngredient('main').first().click();
      cy.go('back');
      cy.url().should('eq', 'http://localhost:4000/');
    });

    it('должен отображать данные выбранного ингредиента в модальном окне', () => {
      cy.getIngredient('main').first().as('selectedIngredient');
      
      cy.get('@selectedIngredient')
        .find(SELECTORS.ingredientName)
        .invoke('text')
        .then((ingredientName) => {
          cy.get('@selectedIngredient').click();
          cy.url().should('include', '/ingredients/');
          cy.get('body').should('contain', ingredientName);
        });
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ и показывать номер заказа', () => {
      cy.addIngredient('bun');
      cy.addIngredient('main');
      
      cy.getOrderButton().click();
      cy.wait('@createOrder');
      
      cy.getModal().should('be.visible');
      cy.get(SELECTORS.orderNumber).should('contain', '12345');
    });

    it('должен закрывать модальное окно заказа и очищать конструктор', () => {
      cy.addIngredient('bun');
      cy.addIngredient('main');
      
      cy.getOrderButton().click();
      cy.wait('@createOrder');
      
      cy.getModalClose().click();
      cy.getModal().should('not.exist');
      
      cy.getConstructorBun().should('not.exist');
      cy.getConstructorIngredients().within(() => {
        cy.get(SELECTORS.constructorIngredient).should('not.exist');
      });
    });
  });
});