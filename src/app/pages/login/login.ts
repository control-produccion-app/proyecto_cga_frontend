import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  usuario = '';
  password = '';
  mensajeError = '';
  cargando = false;
  paso2 = false;
  sessionId = '';
  codigo = '';

  iniciarSesion(): void {
    this.mensajeError = '';

    if (!this.usuario || !this.password) {
      this.mensajeError = 'Debe ingresar usuario y contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.iniciarSesion2FA(this.usuario, this.password).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.paso2 = true;
        this.sessionId = respuesta.session_id;
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Credenciales incorrectas o usuario inactivo.';
      }
    });
  }

  verificarCodigo(): void {
    this.mensajeError = '';

    if (!this.codigo) {
      this.mensajeError = 'Debe ingresar el código de verificación.';
      return;
    }

    this.cargando = true;

    this.authService.verificarCodigo2FA(this.sessionId, this.codigo).subscribe({
      next: (tokens) => {
        sessionStorage.setItem('access_token', tokens.access);
        sessionStorage.setItem('refresh_token', tokens.refresh);

        this.authService.obtenerUsuarioActual().subscribe({
          next: (usuario) => {
            this.cargando = false;
            sessionStorage.setItem('usuario_actual', JSON.stringify(usuario));

            const esAdministrador = usuario.is_superuser || usuario.roles.includes('Administrador');

            if (esAdministrador) {
              this.router.navigate(['/dashboard']);
              return;
            }

            this.router.navigate(['/produccion']);
          },
          error: () => {
            this.cargando = false;
            this.mensajeError = 'Error al obtener datos del usuario.';
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Código incorrecto o expirado.';
      }
    });
  }
}