import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';

export interface DashboardStockBajo {
  id_insumo: number;
  nombre_insumo: string;
  unidad_control: string;
  stock_actual: string | number;
}

export interface DashboardResumen {
  fecha: string;
  jornada_id: number | null;
  comercial_dia: {
    ventas_dia: string | number;
    pagos_dia: string | number;
    saldo_dia: string | number;
    pendientes_pago_dia: number;
  };
  comercial_total: {
    ventas_total: string | number;
    pagos_total: string | number;
    saldo_pendiente_total: string | number;
    pendientes_pago_total: number;
  };
  produccion: {
    quintales_dia: string | number;
  };
  bodega: {
    items_stock_bajo: number;
    stock_bajo: DashboardStockBajo[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = API_CONFIG.apiUrl;

  obtenerResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(
      `${this.apiUrl}/api/reportes/dashboard/`
    );
  }
}
