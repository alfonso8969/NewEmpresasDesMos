import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages/pages.routing';
import { LogoutComponent } from './pages/login/logout.component';

const routes: Routes = [
  { path: 'login', title: "Login", component: LoginComponent},
  { path: 'exit', title: "Salir", component: LogoutComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
