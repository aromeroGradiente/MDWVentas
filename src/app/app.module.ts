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
import { ApiService } from './shared/services/api.service'
import { JwtService } from './shared/services/jwt.service'
import { UserService } from './shared/services/user.service'
import { AuthGuard } from './shared/services/auth-guard.service';
import { ListErrorsComponent } from './shared/list-errors/list-errors.component'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    ListErrorsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [ApiService, JwtService, UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
