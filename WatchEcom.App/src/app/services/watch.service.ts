import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchService {
  private apiUrl = 'http://localhost:7071/api/watches'; // ✅ Adjust to your backend

  constructor(private http: HttpClient) {}

  getWatches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
