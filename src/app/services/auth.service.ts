import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { EnvService } from "./env.service";

type AuthResponse = {
    authenticated: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient,
                private envService: EnvService
    ) { }

    public login(username: string, password: string): Observable<boolean> {
        const token = this.buildAuthToken(username, password);
        return this.http.get<AuthResponse>(`${this.envService.apiBaseUrl}/auth/check`, {
            headers: {
                Authorization: `Basic ${token}`
            }
        }).pipe(map((response: AuthResponse) => {
            if (response.authenticated) {
                localStorage.setItem('authToken', token);
            }
            return response.authenticated;
        }));
    }

    public buildAuthToken(username: string, password: string): string {
        return btoa(`${username}:${password}`);
    }

    public getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    public logout(): void {
        localStorage.removeItem('authToken');
    }
}