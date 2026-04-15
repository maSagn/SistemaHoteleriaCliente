import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingModel } from '../Models/BookingModel';
import { map, Observable } from 'rxjs';
import { Result } from '../Models/Result';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private url = "http://localhost:8081/api/bookings";

  constructor(private http: HttpClient) { }

  getAll(): Observable<BookingModel[]> {
    return this.http.get<Result<BookingModel[]>>(this.url).pipe(
      map(response => response.object)
    );
  }

  getById(idBooking: number): Observable<BookingModel> {
    return this.http.get<Result<BookingModel>>(`${this.url}/${idBooking}`).pipe(
      map(response => response.object)
    );
  }

  add(booking: BookingModel): Observable<BookingModel> {
    return this.http.post<Result<BookingModel>>(this.url, booking).pipe(
      map(response => response.object)
    );
  }

  cancelBooking(idBooking: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${idBooking}/cancel`, {});
  }

  getByGuestEmail(email: string): Observable<BookingModel[]> {
    return this.http.get<Result<BookingModel[]>>(`${this.url}/email/${email}`).pipe(
      map(response => response.object)
    );
  }
}
