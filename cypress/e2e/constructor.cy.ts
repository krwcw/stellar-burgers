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
      cy.get('[data-testid=constructor-bun-top]').should('exist');
      cy.get('[data-testid=constructor-bun-bottom]').should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.addIngredient('main');
      cy.get('[data-testid=constructor-ingredients]').should('exist');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      cy.get('[data-testid=ingredient-main]').first().click();
      cy.url().should('include', '/ingredients/');
    });

    it('должен закрывать модальное окно при клике на крестик', () => {
      cy.get('[data-testid=ingredient-main]').first().click();
      cy.go('back');
      cy.url().should('eq', 'http://localhost:4000/');
    });

    it('должен отображать данные выбранного ингредиента в модальном окне', () => {
      let ingredientName: string;
      
      cy.get('[data-testid=ingredient-main]')
        .first()
        .find('[data-testid=ingredient-name]')
        .invoke('text')
        .then((name) => {
          ingredientName = name;
          cy.get('[data-testid=ingredient-main]').first().click();
          cy.url().should('include', '/ingredients/');
          cy.get('body').should('contain', ingredientName);
        });
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ и показывать номер заказа', () => {
      cy.addIngredient('bun');
      cy.addIngredient('main');
      
      cy.get('[data-testid=order-button]').click();
      cy.wait('@createOrder');
      
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=order-number]').should('contain', '12345');
    });

    it('должен закрывать модальное окно заказа и очищать конструктор', () => {
      cy.addIngredient('bun');
      cy.addIngredient('main');
      
      cy.get('[data-testid=order-button]').click();
      cy.wait('@createOrder');
      
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');
      
      cy.get('[data-testid=constructor-bun-top]').should('not.exist');
      cy.get('[data-testid=constructor-ingredients]').within(() => {
        cy.get('[data-testid=constructor-ingredient]').should('not.exist');
      });
    });
  });
});