import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { PagesModule } from './pages/pages.module';
import { AppComponent } from './app.component';

import { CookieService } from 'ngx-cookie-service';
import { FileUploadService } from './services/file-upload.service';
import { CompaniesService } from './services/companies.service';
import { BenchmarksService } from './services/benchmarks.service';
import { AdminService } from './services/admin.service';
import { EmailService } from './services/email.service';
import { FieldsService } from './services/fields.service';
import { LoginService } from './services/login.service';
import { MenuService } from './services/menu.service';
import { SupportService } from './services/support.service';
import { UsersService } from './services/users.service';
import { LogsService } from './services/logs.service';
import { SessionsService } from './services/sessions.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    PagesModule,
    BrowserAnimationsModule,
    GoogleMapsModule
  ],
  providers: [
    AdminService,
    BenchmarksService,
    CompaniesService,
    EmailService,
    FieldsService,
    FileUploadService,
    LoginService,
    MenuService,
    SupportService,
    UsersService,
    CookieService,
    LogsService,
    SessionsService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
