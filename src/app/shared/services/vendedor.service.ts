import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { Vendedor } from '../models/vendedor.model';



@Injectable()
export class VendedorService {

    constructor(
        private apiService: ApiService,
        private http: Http,
    ) { }

    getAll(): Observable<Vendedor[]> {
        return this.apiService.get(`/vendedores?per_page=5000`)
            .map(response => {
                return response.data.vendedores;
            });
    }

    actualizarVersion(data): Observable<any> {
        return this.apiService.post('/vendedores/actualizar', data)
            .map(response => {
                return response.data;
            })
    }

}
