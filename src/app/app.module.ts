import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PagesModule } from './pages/pages.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CompaniesService } from './services/companies.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { FileUploadService } from './services/file-upload.service';
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
    CompaniesService,
    FileUploadService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
