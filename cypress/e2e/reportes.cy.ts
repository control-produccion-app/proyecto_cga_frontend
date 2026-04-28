describe('Reportes operativos', () => {
  beforeEach(() => {
    cy.login('Administrador');
    cy.visit('/reportes');
  });

  it('debe cargar la pagina de reportes sin errores', () => {
    cy.url().should('include', '/reportes');
    cy.get('body').should('be.visible');
  });

  it('debe consultar stock por insumo', () => {
    cy.intercept('GET', '**/api/reportes/stock_insumo/**', {
      body: {
        insumo_id: 1,
        stock_teorico: 400,
        ultimo_conteo: 395,
        fecha_ultimo_conteo: '2026-04-27',
        diferencia: 5,
      },
    }).as('getStock');

    cy.visit('/reportes');
    cy.wait(1000);
    cy.contains('Stock por insumo').click();
    cy.get('select').first().select('Harina', { force: true });
    cy.wait('@getStock', { timeout: 10000 });
  });
});
