import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { API_CONFIG } from '../config/api.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerAccessToken();

  const esPeticionBackend = req.url.startsWith(API_CONFIG.apiUrl);

  if (!token || !esPeticionBackend) {
    return next(req);
  }

  const reqClonada = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(reqClonada);
};