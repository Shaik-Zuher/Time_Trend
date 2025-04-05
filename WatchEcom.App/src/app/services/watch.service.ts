import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',//says use globally without import
})
export class WatchService {
  private apiUrl = 'http://localhost:5194/api/Watch';

  constructor(private http: HttpClient) {}

  getWatches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
