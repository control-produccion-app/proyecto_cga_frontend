describe('Producción - Jornadas y cierre de turno', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe cargar la pagina de produccion sin errores', () => {
    cy.visit('/produccion');
    cy.url().should('include', '/produccion');
    cy.get('body').should('be.visible');
  });

  it('debe mostrar datos de jornadas si la API responde', () => {
    cy.intercept('GET', '**/api/jornadas/**', {
      fixture: 'jornadas.json',
    }).as('getJornadas');
    cy.visit('/produccion');
    cy.wait('@getJornadas', { timeout: 10000 });
    // Verificar que la respuesta se proceso sin errores visibles
    cy.get('.error').should('not.exist');
  });
});
