import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

import { InjectionToken, NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages/pages.routing';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/login/logout.component';
import { NotFoundComponent } from './pages/login/notfound.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  { path: 'login', title: "Login", component: LoginComponent},
  { path: 'exit', title: "Salir", component: LogoutComponent},
  { path: 'externalRedirect', component: NotFoundComponent, canActivate: [externalUrlProvider]},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.paramMap.get('externalUrl')!;
        window.open(externalUrl, '_self', 'noopener noreferrer nofollow');
      },
    },
  ],
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
