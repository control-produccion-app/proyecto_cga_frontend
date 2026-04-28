describe('Ventas - Pedidos y movimientos comerciales', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe mostrar listado de pedidos', () => {
    cy.intercept('GET', '**/api/pedidos/**', {
      fixture: 'pedidos.json',
    }).as('getPedidos');
    cy.visit('/pedidos-despacho');
    cy.wait('@getPedidos');
    cy.contains('Pedidos').should('be.visible');
  });

  it('debe permitir crear un nuevo pedido', () => {
    cy.intercept('POST', '**/api/pedidos/**', {
      statusCode: 201,
      body: { id_pedido: 2, id_cliente: 1, fecha_pedido: '2026-04-27' },
    }).as('crearPedido');

    cy.visit('/pedidos-despacho');
    cy.contains('Nuevo pedido').click();
    cy.get('select').first().select('1');
    cy.contains('Guardar').click();
    cy.wait('@crearPedido');
  });

  it('debe permitir registrar un movimiento (despacho)', () => {
    cy.intercept('POST', '**/api/movimientos/**', {
      statusCode: 201,
      body: { id_detalle: 3, id_cliente: 1, cantidad_entregada: 50 },
    }).as('crearMovimiento');

    cy.visit('/pedidos-despacho');
    cy.contains('Registrar despacho').click();
    cy.get('input[type="number"]').first().type('50');
    cy.contains('Guardar').click();
    cy.wait('@crearMovimiento');
  });
});
