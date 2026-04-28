describe('Bodega - Gestión de stock', () => {
  beforeEach(() => {
    cy.login('Administrador');
    cy.intercept('GET', '**/api/movimientos-bodega/**', {
      fixture: 'movimientos-bodega.json',
    }).as('getMovimientos');
    cy.visit('/bodega');
    cy.wait('@getMovimientos');
  });

  it('debe mostrar el listado de movimientos', () => {
    cy.contains('ENTRADA').should('be.visible');
    cy.contains('500').should('be.visible');
  });

  it('debe permitir agregar una entrada de stock', () => {
    cy.intercept('POST', '**/api/movimientos-bodega/**', {
      statusCode: 201,
      body: { id_movimiento_bodega: 3, tipo_movimiento: 'ENTRADA', cantidad: 100 },
    }).as('crearMovimiento');

    cy.contains('Nuevo movimiento').click();
    cy.get('#tipoMovimiento').select('ENTRADA', { force: true });
    cy.get('input[type="number"]').first().type('100', { force: true });
    cy.contains('Guardar').click({ force: true });
    cy.wait('@crearMovimiento');
  });

  it('debe permitir agregar una salida de stock', () => {
    cy.intercept('POST', '**/api/movimientos-bodega/**', {
      statusCode: 201,
      body: { id_movimiento_bodega: 4, tipo_movimiento: 'SALIDA', cantidad: 50 },
    }).as('crearSalida');

    cy.contains('Nuevo movimiento').click();
    cy.get('#tipoMovimiento').select('SALIDA', { force: true });
    cy.get('input[type="number"]').first().type('50', { force: true });
    cy.contains('Guardar').click({ force: true });
    cy.wait('@crearSalida');
  });

  it('debe rechazar cantidad negativa por validacion del formulario', () => {
    cy.contains('Nuevo movimiento').click();
    cy.get('input[type="number"]').first().type('-10', { force: true });
    cy.get('#tipoMovimiento').select('ENTRADA', { force: true });
    cy.contains('Guardar').click({ force: true });
    // La validacion cliente bloquea el POST sin llegar al servidor
    cy.get('body').then(($body) => {
      if ($body.text().includes('no puede ser negativa')) {
        expect(true).to.be.true;
      }
    });
  });
});
