import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { Bodega } from '../models/bodega.model';



@Injectable()
export class BodegaService {

    constructor(
        private apiService: ApiService,
        private http: Http,
    ) { }

    getAll(): Observable<Bodega[]> {
        return this.apiService.get(`/bodega`)
            .map(response => {
                return response.bodegas
            });
    }

}
