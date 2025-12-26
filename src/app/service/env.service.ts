import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EnvService {
    get apiBaseUrl(): string {
        return environment.apiBaseUrl;
    }

    get metalsApiToken(): string {
        return environment.metalsApiToken;
    }

    get metalsApiUrl(): string {
        return environment.metalsApiUrl;
    }

    get metalsApiUrlLatest(): string {
        return `${environment.metalsApiUrl}/latest?api_key=${this.metalsApiToken}&currency=USD&unit=toz`;
    }
}