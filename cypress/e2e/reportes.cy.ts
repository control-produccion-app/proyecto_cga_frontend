describe('Reportes operativos', () => {
  beforeEach(() => {
    cy.login('Administrador');
    cy.visit('/reportes');
  });

  it('debe mostrar el reporte de stock por insumo', () => {
    cy.intercept('GET', '**/api/reportes/stock_insumo/**', {
      body: {
        insumo_id: 1,
        stock_teorico: 400,
        ultimo_conteo: 395,
        fecha_ultimo_conteo: '2026-04-27',
        diferencia: 5,
      },
    }).as('getStock');

    cy.contains('Stock por insumo').click();
    cy.get('select').first().select('Harina');
    cy.wait('@getStock');
    cy.contains('400').should('be.visible');
    cy.contains('395').should('be.visible');
    cy.contains('5').should('be.visible');
  });

  it('debe mostrar error si no se selecciona insumo', () => {
    cy.intercept('GET', '**/api/reportes/stock_insumo/**', {
      statusCode: 400,
      body: { error: 'insumo_id es requerido' },
    }).as('getStockError');

    cy.contains('Stock por insumo').click();
    cy.contains('Consultar').click();
    cy.wait('@getStockError');
    cy.contains('insumo_id es requerido').should('be.visible');
  });
});
