import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { ListErrorsComponent } from './shared/list-errors/list-errors.component';
import { VendedoresComponent } from './vendedores/vendedores.component'

import { ApiService } from './shared/services/api.service'
import { JwtService } from './shared/services/jwt.service'
import { UserService } from './shared/services/user.service'
import { AuthGuard } from './shared/services/auth-guard.service';
import { VendedorService } from './shared/services/vendedor.service';
import { VendedorTipoService } from './shared/services/vendedor-tipo.service';
import { BodegaService } from './shared/services/bodega.service';
import { PagerService } from './shared/services/pager.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    ListErrorsComponent,
    VendedoresComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers:
    [
        ApiService,
        JwtService,
        UserService,
        AuthGuard,
        VendedorService,
        BodegaService,
        VendedorTipoService,
        PagerService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
