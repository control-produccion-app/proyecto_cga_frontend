import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import {
  DashboardResumen,
  DashboardService,
  DashboardStockBajo
} from '../../features/dashboard/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  resumen = signal<DashboardResumen | null>(null);
  cargando = signal<boolean>(false);
  mensajeError = signal<string>('');

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.dashboardService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.cargando.set(false);
      },
      error: (error: any) => {
        this.cargando.set(false);
        this.mensajeError.set(
          this.obtenerMensajeError(error, 'No se pudo cargar el resumen del dashboard')
        );
      }
    });
  }

  get stockBajo(): DashboardStockBajo[] {
    return this.resumen()?.bodega.stock_bajo ?? [];
  }

  formatearDinero(valor: string | number | null | undefined): string {
    const numero = this.convertirNumero(valor);

    return numero.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    });
  }

  formatearNumero(valor: string | number | null | undefined): string {
    const numero = this.convertirNumero(valor);

    return numero.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return '-';
    }

    const [anio, mes, dia] = fecha.split('-');

    if (!anio || !mes || !dia) {
      return fecha;
    }

    return `${dia}-${mes}-${anio}`;
  }

  private convertirNumero(valor: string | number | null | undefined): number {
    if (valor === null || valor === undefined || valor === '') {
      return 0;
    }

    const numero = Number(String(valor).replace(',', '.'));

    return Number.isNaN(numero) ? 0 : numero;
  }

  private obtenerMensajeError(error: any, mensajeDefecto: string): string {
    const status = error?.status ? ` HTTP ${error.status}.` : '';
    const errores = error?.error;

    if (error?.status === 401) {
      return 'Tu sesión expiró o el token ya no es válido. Cierra sesión e inicia nuevamente.';
    }

    if (!errores) {
      return `${mensajeDefecto}.${status}`;
    }

    if (typeof errores === 'string') {
      return `${mensajeDefecto}.${status} Detalle: ${errores}`;
    }

    if (errores.detail) {
      return `${mensajeDefecto}.${status} Detalle: ${errores.detail}`;
    }

    if (errores.error) {
      return `${mensajeDefecto}.${status} Detalle: ${errores.error}`;
    }

    return `${mensajeDefecto}.${status}`;
  }
}
