import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
