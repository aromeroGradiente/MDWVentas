import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { VendedoresComponent } from './vendedores/vendedores.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'trabajar-con-vendedores', component: VendedoresComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
