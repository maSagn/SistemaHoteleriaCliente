import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RoomModel } from '../Models/RoomModel';
import { Result } from '../Models/Result';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private url = "http://localhost:8081/api/rooms";

  constructor(private http: HttpClient) { }

  getAll(): Observable<RoomModel[]> {
    return this.http.get<Result<RoomModel[]>>(this.url).pipe(
      map(response => response.object)
    );
  }

  getById(idRoom: number): Observable<RoomModel> {
    return this.http.get<Result<RoomModel>>(`${this.url}/${idRoom}`).pipe(
      map(response => response.object)
    );
  }

  delete(idRoom: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${idRoom}`);
  }
}
