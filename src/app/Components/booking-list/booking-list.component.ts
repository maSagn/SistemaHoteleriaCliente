import { Component } from '@angular/core';
import { BookingModel } from '../../Models/BookingModel';
import { BookingService } from '../../Service/booking.service';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-booking-list',
  standalone: false,
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent {
  bookings: BookingModel[] = [];

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.cargarBookings();
  }

  cargarBookings() {
    this.bookingService.getAll().subscribe(
      data => {
        this.bookings = data;
        console.log("Reservas cargadas", data);
      }, error => {
        console.log("Error al obtener las reservas");
      })
  }

  cancelarReserva(idBooking: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir este proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelala!",
      cancelButtonText: "Cancelar"
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.bookingService.cancelBooking(idBooking).subscribe(() => {
          Swal.fire({
            title: "¡Reserva cancelada!",
            text: "La reserva ha sido cancelada satisfactoriamente.",
            icon: "success"
            // timer: 2000
          });
          // Recargar lista después de eliminar
          this.cargarBookings();
        }, error => {
          Swal.fire({
            title: "Error",
            text: error.error || "No se cancelar la reserva.",
            icon: "error"
          });
        });
      }
    });
  }

  emailBusqueda: string = '';

  buscarPorEmail() {
    if (!this.emailBusqueda) return;

    this.bookingService.getByGuestEmail(this.emailBusqueda).subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (err) => {
        console.error(err);
        
      }
    })
  }

  limpiarBusqueda() {
    this.emailBusqueda = '';
    this.cargarBookings();
  }

  statusSeleccionado: string = '';

  filtrarPorStatus() {
    this.bookings = [];
    this.bookingService.getByStatus(this.statusSeleccionado).subscribe(data => {
      this.bookings = data;
    });
  }

  limpiarFiltro() {
    this.statusSeleccionado = '';
    this.cargarBookings();
  }

}
