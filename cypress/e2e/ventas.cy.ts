describe('Ventas - Pedidos y movimientos comerciales', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe cargar la pagina de pedidos sin errores', () => {
    cy.visit('/pedidos-despacho');
    cy.url().should('include', '/pedidos-despacho');
    cy.get('body').should('be.visible');
  });
});
