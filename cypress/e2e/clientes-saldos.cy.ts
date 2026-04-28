describe('Clientes - Saldos y pagos', () => {
  beforeEach(() => {
    cy.login('Administrador');
    cy.visit('/clientes-saldos');
  });

  it('debe mostrar listado de clientes', () => {
    cy.intercept('GET', '**/api/clientes/**', {
      fixture: 'mock-data.json',
    }).as('getClientes');
    cy.contains('Clientes').should('be.visible');
  });

  it('debe mostrar saldo acumulado de un cliente', () => {
    cy.intercept('GET', '**/api/clientes/1/saldo/**', {
      body: {
        cliente_id: 1,
        cliente_nombre: 'Supermercado Los Andes',
        total_venta: 118750,
        total_pago: 50000,
        saldo_acumulado: 68750,
      },
    }).as('getSaldo');
    cy.contains('Supermercado Los Andes').click();
    cy.contains('Saldo').should('be.visible');
    cy.contains('68.750').should('be.visible');
  });

  it('debe mostrar el resumen de movimientos por jornada', () => {
    cy.intercept('GET', '**/api/movimientos/resumen_jornada/**', {
      fixture: 'mock-data.json',
    }).as('getResumen');
    cy.contains('Resumen por jornada').click();
    cy.contains('Supermercado Los Andes').should('be.visible');
  });
});
