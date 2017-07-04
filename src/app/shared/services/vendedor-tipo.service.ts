import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';


import { VendedorTipo } from '../models/vendedor-tipo.model';
import { ApiService } from './api.service';




@Injectable()
export class VendedorTipoService {

    constructor(
        private apiService: ApiService,
        private http: Http,
    ) { }

    getAll(): Observable<VendedorTipo[]> {
        return this.apiService.get(`/vendedor_tipo`)
            .map(response => {
                return response.vendedores_tipos
            });
    }

}
