import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BenchMarks } from '../interfaces/benchmarks';

@Injectable({
  providedIn: 'root'
})
export class BenchmarksService {

  url: String = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getFieldsForBenchMarks(field: string): Observable<BenchMarks[]> {
    return this.http.post<BenchMarks[]>(`${this.url}/getFieldsForBenchMarks.php`, { field: field })
  }

}
