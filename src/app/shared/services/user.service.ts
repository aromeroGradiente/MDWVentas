import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: Http,
    private jwtService: JwtService
  ) { }

  // Verificar JWT en localstorage
  // Se ejecuta una vez al iniciar la aplicación
  populate() {
    // Si JWT detectado traemos información del usuario
    // TODO: traer información usuario
    if (this.jwtService.getToken()) {
       // this.apiService.get('/user')
       //  .subscribe(
       //  data => this.setAuth(data.user),
       //  err => this.purgeAuth()
       //  );
    } else {
      // Remover cualquier remanente de información
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Guardar JWT en localstorage
    this.jwtService.saveToken(user.token);
    // Seteamos los datos del usuario actual en observable
    this.currentUserSubject.next(user);
    // Seteamos autenticado a verdadero
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remover JWT del localstorage
    this.jwtService.destroyToken();
    // Seteamos los datos del usuario a vacío
    this.currentUserSubject.next(new User());
    // Seteamos autenticado a falso
    this.isAuthenticatedSubject.next(false);
  }

  // TODO: Cambiar URL por especifica de login para middleware
  attemptAuth(credentials): Observable<User> {
    const auth = {
      'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password),

    }
    return this.apiService.post('/users/authenticate', {}, auth)
      .map(
      response => {
        const data = response.data;
        this.setAuth(data.user);
        return data.user;
      }
      );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

}
