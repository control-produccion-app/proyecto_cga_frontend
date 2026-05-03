describe('Reportes operativos', () => {
  beforeEach(() => {
    cy.login('Administrador');
    cy.visit('/reportes');
  });

  it('debe cargar la pagina de reportes sin errores', () => {
    cy.url().should('include', '/reportes');
    cy.get('body').should('be.visible');
  });
});
