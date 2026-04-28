describe('Bodega - Gestión de stock', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe cargar la pagina de bodega sin errores', () => {
    cy.visit('/bodega');
    cy.url().should('include', '/bodega');
    cy.get('body').should('be.visible');
  });

  it('debe mostrar el listado de movimientos', () => {
    cy.intercept('GET', '**/api/movimientos-bodega/**', {
      fixture: 'movimientos-bodega.json',
    }).as('getMovimientos');
    cy.visit('/bodega');
    cy.wait('@getMovimientos', { timeout: 10000 });
    cy.contains('ENTRADA').should('be.visible');
    cy.contains('500').should('be.visible');
  });

  it('debe rechazar cantidad negativa por validacion del formulario', () => {
    cy.visit('/bodega');
    cy.contains('Nuevo movimiento').click();
    cy.get('input[type="number"]').first().type('-10', { force: true });
    cy.get('#tipoMovimiento').select('ENTRADA', { force: true });
    cy.contains('Guardar').click({ force: true });
  });
});
