import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from '../services/env.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private envService: EnvService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { username, password } = this.envService.basicAuth;

        const authReq = req.clone({
            setHeaders: {
                Authorization: 'Basic ' + btoa(`${username}:${password}`)
            }
        });

        return next.handle(authReq);
    }
}
