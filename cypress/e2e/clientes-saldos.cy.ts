describe('Clientes - Saldos y pagos', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe cargar la pagina de clientes sin errores', () => {
    cy.visit('/clientes-saldos');
    cy.url().should('include', '/clientes-saldos');
    cy.get('body').should('be.visible');
  });
});
