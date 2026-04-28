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
    cy.get('select').first().select('ENTRADA');
    cy.get('input[type="number"]').first().type('100');
    cy.contains('Guardar').click();
    cy.wait('@crearMovimiento');
  });

  it('debe permitir agregar una salida de stock', () => {
    cy.intercept('POST', '**/api/movimientos-bodega/**', {
      statusCode: 201,
      body: { id_movimiento_bodega: 4, tipo_movimiento: 'SALIDA', cantidad: 50 },
    }).as('crearSalida');

    cy.contains('Nuevo movimiento').click();
    cy.get('select').first().select('SALIDA');
    cy.get('input[type="number"]').first().type('50');
    cy.contains('Guardar').click();
    cy.wait('@crearSalida');
  });

  it('debe mostrar error si la cantidad es negativa', () => {
    cy.intercept('POST', '**/api/movimientos-bodega/**', {
      statusCode: 400,
      body: { error: 'La cantidad no puede ser negativa' },
    }).as('crearError');

    cy.contains('Nuevo movimiento').click();
    cy.get('input[type="number"]').first().type('-10');
    cy.contains('Guardar').click();
    cy.wait('@crearError');
    cy.contains('no puede ser negativa').should('be.visible');
  });

  it('debe permitir realizar un conteo fisico', () => {
    cy.intercept('POST', '**/api/conteos-bodega/**', {
      statusCode: 201,
      body: { id_conteo_bodega: 2, cantidad_fisica: 950 },
    }).as('crearConteo');

    cy.contains('Nuevo conteo').click();
    cy.get('input[type="number"]').first().type('950');
    cy.contains('Guardar').click();
    cy.wait('@crearConteo');
  });
});
