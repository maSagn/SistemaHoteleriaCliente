import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../Service/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: false,
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  bookigForm!: FormGroup;
  idBooking!: number | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.bookigForm = this.fb.group({
      idBooking: [''],
      guestName: [''],
      guestEmail: [''],
      checkIn: [''],
      checkOut: [''],
      totalPrice: [''],
      status: [''],
      room: this.fb.group({
        roomNumber: ['']
      })
    })

    // Revisar si hay un id en la ruta
    this.idBooking = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idBooking) {
      this.bookingService.getById(this.idBooking).subscribe(booking => {
        this.bookigForm.patchValue({
          idBooking: booking.idBooking,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          checkIn: this.formatearFecha(booking.checkIn),
          checkOut: this.formatearFecha(booking.checkOut),
          totalPrice: booking.totalPrice,
          status: booking.status,
          room: {
            roomNumber: booking.room.roomNumber
          }
        });
      });
    }
  }

  mensajeError: string = '';

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toISOString().split('T')[0];
  }

}
