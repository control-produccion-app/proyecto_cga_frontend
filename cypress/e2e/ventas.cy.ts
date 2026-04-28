describe('Ventas - Pedidos y movimientos comerciales', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe cargar la pagina de pedidos sin errores', () => {
    cy.intercept('GET', '**/api/pedidos/**', {
      fixture: 'pedidos.json',
    }).as('getPedidos');
    cy.visit('/pedidos-despacho');
    cy.wait('@getPedidos', { timeout: 10000 });
    cy.url().should('include', '/pedidos-despacho');
    cy.get('body').should('be.visible');
  });
});
