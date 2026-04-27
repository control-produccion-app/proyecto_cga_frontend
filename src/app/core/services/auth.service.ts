import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';

export interface TokensJwt {
  access: string;
  refresh: string;
}

export interface InicioSesion2FAResponse {
  session_id: string;
  message: string;
  expires_in: number;
}

export interface UsuarioActual {
  id: number;
  username: string;
  is_superuser: boolean;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = API_CONFIG.apiUrl;

  iniciarSesion(username: string, password: string): Observable<UsuarioActual> {
    return this.http.post<TokensJwt>(`${this.apiUrl}/api/token/`, {
      username,
      password
    }).pipe(
      tap((tokens) => {
        sessionStorage.setItem('access_token', tokens.access);
        sessionStorage.setItem('refresh_token', tokens.refresh);
      }),
      switchMap(() => this.obtenerUsuarioActual()),
      tap((usuario) => {
        sessionStorage.setItem('usuario_actual', JSON.stringify(usuario));
      })
    );
  }

  iniciarSesion2FA(username: string, password: string): Observable<InicioSesion2FAResponse> {
    return this.http.post<InicioSesion2FAResponse>(`${this.apiUrl}/api/token/2fa/`, {
      username,
      password
    });
  }

  verificarCodigo2FA(session_id: string, code: string): Observable<TokensJwt> {
    return this.http.post<TokensJwt>(`${this.apiUrl}/api/token/2fa/verify/`, {
      session_id,
      code
    });
  }

  obtenerUsuarioActual(): Observable<UsuarioActual> {
    return this.http.get<UsuarioActual>(`${this.apiUrl}/api/me/`);
  }

  obtenerAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  obtenerUsuarioGuardado(): UsuarioActual | null {
    const usuarioGuardado = sessionStorage.getItem('usuario_actual');

    if (!usuarioGuardado) {
      return null;
    }

    return JSON.parse(usuarioGuardado) as UsuarioActual;
  }

  estaAutenticado(): boolean {
    return this.obtenerAccessToken() !== null;
  }

  esAdministrador(): boolean {
    const usuario = this.obtenerUsuarioGuardado();

    if (!usuario) {
      return false;
    }

    return usuario.is_superuser || usuario.roles.includes('Administrador');
  }

  esEncargadoTurno(): boolean {
    const usuario = this.obtenerUsuarioGuardado();

    if (!usuario) {
      return false;
    }

    return usuario.roles.includes('Encargado de turno');
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario_actual');
  }
}