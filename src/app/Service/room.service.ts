import { HttpClient, HttpParams } from '@angular/common/http';
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

  add(room: RoomModel): Observable<RoomModel> {
    return this.http.post<Result<RoomModel>>(this.url, room).pipe(
      map(response => response.object)
    );
  }

  update(room: RoomModel, idRoom: number): Observable<RoomModel> {
    return this.http.patch<Result<RoomModel>>(`${this.url}/${idRoom}`, room).pipe(
      map(response => response.object)
    );
  }

  delete(idRoom: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${idRoom}`);
  }

  getAvailableRooms(): Observable<RoomModel[]> {
    return this.http.get<Result<RoomModel[]>>(`${this.url}/availableRooms`).pipe(
      map(response => response.object)
    );
  }

  getAvailableRoomsPerType(type: string): Observable<RoomModel[]> {
    const params = new HttpParams().set('type', type);

    return this.http.get<Result<RoomModel[]>>(`${this.url}/available`, { params }).pipe(
      map(response => response.object)
    );
  }

  getByFilters(tipo: string, disponible: boolean | null) {
    let params: any = {};

    if (tipo) params.tipo = tipo;
    if (disponible !== null) params.disponible = disponible;

    return this.http.get<Result<RoomModel[]>>(`${this.url}/filter`, { params }).pipe(
      map(response => response.object)
    )
  }
}
