Cypress.Commands.add('login', (rol: string = 'Administrador') => {
  cy.intercept('POST', '**/api/token/2fa/', {
    body: { session_id: 'test-session-id', message: 'Código enviado', expires_in: 300 },
  }).as('step1');

  cy.intercept('POST', '**/api/token/2fa/verify/', {
    body: { access: 'fake-jwt-token', refresh: 'fake-refresh-token' },
  }).as('step2');

  cy.intercept('GET', '**/api/me/', {
    body: {
      id: 1,
      username: 'admin',
      is_superuser: rol === 'Administrador',
      roles: [rol],
    },
  }).as('me');

  cy.visit('/login');
  cy.get('#usuario').type('admin');
  cy.get('#password').type('Admin123');
  cy.contains('Ingresar al sistema').click();
  cy.wait('@step1');
  cy.get('#codigo').type('123456');
  cy.contains('Verificar e ingresar').click();
  cy.wait('@step2');
  cy.wait('@me');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(rol?: string): Chainable<void>;
    }
  }
}
