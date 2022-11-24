import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages/pages.routing';

const routes: Routes = [
  { path: 'login', title: "Login", component: LoginComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
