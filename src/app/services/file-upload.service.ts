import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, fileName: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('image', file, fileName);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const req = new HttpRequest('POST', `${this.baseUrl}/save.php`, formData, {
      headers: headers
    });

    return this.http.request(req);
  }

  public getPdf(fileName: string): Observable<Blob> {
    let url = this.baseUrl + '/attachment/' + fileName;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.get<Blob>(url, { headers : headers, responseType : 'blob' as 'json'});
  }
}
