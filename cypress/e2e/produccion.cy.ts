describe('Producción - Jornadas y cierre de turno', () => {
  beforeEach(() => {
    cy.login('Administrador');
  });

  it('debe mostrar listado de jornadas', () => {
    cy.intercept('GET', '**/api/jornadas/**', {
      fixture: 'mock-data.json',
    }).as('getJornadas');
    cy.visit('/produccion');
    cy.contains('Jornadas').should('be.visible');
  });

  it('debe permitir crear una nueva jornada', () => {
    cy.intercept('POST', '**/api/jornadas/**', {
      statusCode: 201,
      body: { id_jornada: 3, fecha: '2026-04-28' },
    }).as('crearJornada');

    cy.visit('/produccion');
    cy.contains('Nueva jornada').click();
    cy.get('input[type="date"]').type('2026-04-28');
    cy.contains('Guardar').click();
    cy.wait('@crearJornada');
    cy.contains('Jornada creada').should('be.visible');
  });

  it('debe permitir registrar produccion en una jornada', () => {
    cy.intercept('POST', '**/api/producciones/**', {
      statusCode: 201,
      body: { id_produccion: 3, quintales: 30 },
    }).as('crearProduccion');

    cy.visit('/produccion');
    cy.contains('Registrar producción').click();
    cy.get('input[type="number"]').first().type('30');
    cy.contains('Guardar').click();
    cy.wait('@crearProduccion');
    cy.contains('Producción registrada').should('be.visible');
  });

  it('debe permitir cerrar un turno', () => {
    cy.intercept('POST', '**/api/cierres-turno/**', {
      statusCode: 201,
      body: { id_cierre_turno: 1, estado: 'CERRADO' },
    }).as('cerrarTurno');

    cy.visit('/produccion');
    cy.contains('Cerrar turno').click();
    cy.contains('Confirmar').click();
    cy.wait('@cerrarTurno');
    cy.contains('Turno cerrado').should('be.visible');
  });

  it('debe mostrar error al cerrar un turno ya cerrado', () => {
    cy.intercept('POST', '**/api/cierres-turno/**', {
      statusCode: 400,
      body: { error: 'El cierre ya está cerrado' },
    }).as('cerrarTurnoError');

    cy.visit('/produccion');
    cy.contains('Cerrar turno').click();
    cy.contains('Confirmar').click();
    cy.wait('@cerrarTurnoError');
    cy.contains('error').should('be.visible');
  });
});
