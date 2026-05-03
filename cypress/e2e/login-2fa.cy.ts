describe('Login 2FA', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('debe mostrar formulario de credenciales en paso 1', () => {
    cy.get('#usuario').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.contains('Ingresar al sistema').should('be.visible');
    cy.contains('Código de verificación').should('not.exist');
  });

  it('debe mostrar error si los campos estan vacios', () => {
    cy.contains('Ingresar al sistema').click();
    cy.contains('Debe ingresar usuario y contraseña').should('be.visible');
  });

  it('debe mostrar paso 2 al enviar credenciales validas', () => {
    cy.intercept('POST', '**/api/token/2fa/', {
      body: { session_id: 'test-session', message: 'Código enviado', expires_in: 300 },
    }).as('login2fa');

    cy.get('#usuario').type('admin');
    cy.get('#password').type('Admin123');
    cy.contains('Ingresar al sistema').click();
    cy.wait('@login2fa');

    cy.get('#codigo').should('be.visible');
    cy.contains('Verificar e ingresar').should('be.visible');
    cy.contains('código de verificación').should('be.visible');
  });

  it('debe mostrar error si el codigo es incorrecto', () => {
    cy.intercept('POST', '**/api/token/2fa/', {
      body: { session_id: 'test-session', message: 'Código enviado', expires_in: 300 },
    }).as('step1');
    cy.intercept('POST', '**/api/token/2fa/verify/', {
      statusCode: 401,
      body: { error: 'Código inválido o expirado' },
    }).as('verify');

    cy.get('#usuario').type('admin');
    cy.get('#password').type('Admin123');
    cy.contains('Ingresar al sistema').click();
    cy.wait('@step1');
    cy.get('#codigo').type('000000');
    cy.contains('Verificar e ingresar').click();
    cy.wait('@verify');
    cy.contains('Código incorrecto o expirado').should('be.visible');
  });

  it('debe mostrar error si las credenciales son invalidas', () => {
    cy.intercept('POST', '**/api/token/2fa/', {
      statusCode: 401,
      body: { error: 'Credenciales incorrectas' },
    }).as('login2fa');

    cy.get('#usuario').type('invalido');
    cy.get('#password').type('malpassword');
    cy.contains('Ingresar al sistema').click();
    cy.wait('@login2fa');

    cy.contains('Credenciales incorrectas o usuario inactivo').should('be.visible');
  });

  it('debe redirigir a /dashboard si el usuario es Administrador', () => {
    cy.login('Administrador');
    cy.url().should('include', '/dashboard');
  });

  it('debe redirigir a /produccion si el usuario NO es Administrador', () => {
    cy.login('Encargado de turno');
    cy.url().should('include', '/produccion');
  });
});
