describe('Clientes - Saldos y pagos', () => {
  beforeEach(() => {
    cy.login('Administrador');
    cy.intercept('GET', '**/api/clientes/**', {
      fixture: 'clientes.json',
    }).as('getClientes');
    cy.visit('/clientes-saldos');
    cy.wait('@getClientes');
  });

  it('debe mostrar listado de clientes', () => {
    cy.contains('Supermercado Los Andes').should('be.visible');
    cy.contains('Restaurante La Familia').should('be.visible');
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
    cy.wait('@getSaldo').then(() => {
      cy.contains('Saldo').should('be.visible');
    });
  });

  it('debe mostrar el resumen de movimientos por jornada', () => {
    cy.intercept('GET', '**/api/movimientos/resumen_jornada/**', {
      body: [
        { id_cliente: 1, id_cliente__nombre_cliente: 'Supermercado Los Andes', total_venta: 118750, total_pago: 50000, saldo_dia: 68750 }
      ],
    }).as('getResumen');

    cy.contains('Resumen por jornada').click();
    cy.wait('@getResumen');
    cy.contains('Supermercado Los Andes').should('be.visible');
  });
});
