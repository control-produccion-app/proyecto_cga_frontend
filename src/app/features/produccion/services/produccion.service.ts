import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

export interface ProduccionRegistro {
  id_produccion: number;
  tipo_produccion_nombre: string;
  turno_nombre: string;
  jornada_fecha: string;
  quintales: string | number;
  id_jornada: number;
  id_tipo_produccion: number;
  id_turno: number;
}

export interface TipoProduccion {
  id_tipo_produccion: number;
  nombre_tipo_produccion: string;
  insumo_principal_nombre?: string | null;
  id_insumo_principal?: number | null;
}

export interface Jornada {
  id_jornada: number;
  fecha: string;
}

export interface Turno {
  id_turno: number;
  nombre_turno: string;
}

export interface InsumoCatalogo {
  id_insumo: number;
  nombre_insumo: string;
  unidad_control: string;
  stock_sugerido_inicial: string | number;
  activo: string;
}

export interface NuevaProduccion {
  quintales: string | number;
  id_jornada: number;
  id_tipo_produccion: number;
  id_turno: number;
}

export interface NuevaJornada {
  fecha: string;
}

export interface NuevoTipoProduccion {
  nombre_tipo_produccion: string;
  id_insumo_principal?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.apiUrl;

  listarProducciones(): Observable<ProduccionRegistro[]> {
    return this.http
      .get<ProduccionRegistro[] | { value?: ProduccionRegistro[] }>(
        `${this.apiUrl}/api/producciones/`
      )
      .pipe(map((respuesta) => this.extraerLista<ProduccionRegistro>(respuesta)));
  }

  crearProduccion(payload: NuevaProduccion): Observable<ProduccionRegistro> {
    return this.http.post<ProduccionRegistro>(
      `${this.apiUrl}/api/producciones/`,
      payload
    );
  }

  listarTiposProduccion(): Observable<TipoProduccion[]> {
    return this.http
      .get<TipoProduccion[] | { value?: TipoProduccion[] }>(
        `${this.apiUrl}/api/tipos-produccion/`
      )
      .pipe(map((respuesta) => this.extraerLista<TipoProduccion>(respuesta)));
  }

  crearTipoProduccion(payload: NuevoTipoProduccion): Observable<TipoProduccion> {
    return this.http.post<TipoProduccion>(
      `${this.apiUrl}/api/tipos-produccion/`,
      payload
    );
  }

  actualizarTipoProduccion(
    idTipoProduccion: number,
    payload: NuevoTipoProduccion
  ): Observable<TipoProduccion> {
    return this.http.put<TipoProduccion>(
      `${this.apiUrl}/api/tipos-produccion/${idTipoProduccion}/`,
      payload
    );
  }

  listarJornadas(): Observable<Jornada[]> {
    return this.http
      .get<Jornada[] | { value?: Jornada[] }>(
        `${this.apiUrl}/api/jornadas/`
      )
      .pipe(map((respuesta) => this.extraerLista<Jornada>(respuesta)));
  }

  crearJornada(payload: NuevaJornada): Observable<Jornada> {
    return this.http.post<Jornada>(
      `${this.apiUrl}/api/jornadas/`,
      payload
    );
  }

  listarTurnos(): Observable<Turno[]> {
    return this.http
      .get<Turno[] | { value?: Turno[] }>(
        `${this.apiUrl}/api/turnos/`
      )
      .pipe(map((respuesta) => this.extraerLista<Turno>(respuesta)));
  }

  listarInsumos(): Observable<InsumoCatalogo[]> {
    return this.http
      .get<InsumoCatalogo[] | { value?: InsumoCatalogo[] }>(
        `${this.apiUrl}/api/catalogo/insumos/`
      )
      .pipe(map((respuesta) => this.extraerLista<InsumoCatalogo>(respuesta)));
  }

  private extraerLista<T>(respuesta: T[] | { value?: T[] } | null | undefined): T[] {
    if (Array.isArray(respuesta)) {
      return respuesta;
    }

    if (respuesta && Array.isArray(respuesta.value)) {
      return respuesta.value;
    }

    return [];
  }
}