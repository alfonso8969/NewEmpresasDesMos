import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private urlEmail: string;
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.urlEmail = environment.urlPHPEmail;
    this.baseUrl = environment.apiUrl;
   }
}
