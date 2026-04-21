import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../Service/booking.service';
import { RoomModel } from '../../Models/RoomModel';
import { RoomService } from '../../Service/room.service';
import { BookingModel } from '../../Models/BookingModel';
import { AuthService } from '../../Service/auth.service';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-booking-form',
  standalone: false,
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  bookigForm!: FormGroup;
  idBooking!: number | null;
  rooms: RoomModel[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private roomService: RoomService,
    private authService: AuthService
  ) { }

  fechaMinima: string = '';
  minCheckOut: string = '';
  maxCheckOut: string = '';
  

  ngOnInit(): void {
    this.fechaMinima = this.obtenerFechaHoy();

    this.bookigForm = this.fb.group({
      idBooking: [''],
      guestName: [''],
      guestEmail: [''],
      checkIn: [''],
      checkOut: [''],
      totalPrice: [''],
      status: [''],
      room: this.fb.group({
        roomNumber: [''],
        idRoom: [''],
        pricePerNight: ['']
      }),
      usuario: this.fb.group({
        idUsuario: ['']
      }),
    }, { validators: this.validarFechas.bind(this) });
    this.bookigForm.get('checkIn')?.valueChanges.subscribe(value => {
      if (value) {
        const fecha = new Date(value);

        // mínimo: siguiente día
        const min = new Date(fecha);
        min.setDate(min.getDate() + 1);

        // máximo: 30 días después
        const max = new Date(fecha);
        max.setDate(max.getDate() + 30);

        this.minCheckOut = this.formatearFecha(min);
        this.maxCheckOut = this.formatearFecha(max);
      }

      this.calcularTotal();
    });

    this.bookigForm.get('checkOut')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });

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
            roomNumber: booking.room.roomNumber,
            idRoom: booking.room.idRoom,
            pricePerNight: booking.room.pricePerNight
          }
        });
      });
    }
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toISOString().split('T')[0];
  }

  obtenerFechaHoy(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  abrirModal() {
    this.roomService.getAvailableRooms().subscribe(data => {
      this.rooms = data;
      console.log("Habitaciones disponibles cargadas", data);

      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('roomModal')
      );
      modal.show();
    });
  }

  seleccionarRoom(room: any) {
    // Setear en el form
    this.bookigForm.patchValue({
      room: {
        roomNumber: room.roomNumber,
        idRoom: room.idRoom,
        pricePerNight: room.pricePerNight
      }
    });

    this.calcularTotal();

    // Cerrar modal
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById('roomModal')
    );
    modal.hide();
  }

  mensajeError: string = '';

  guardar() {
    if (this.bookigForm.valid) {

      // Obtener al usuario logueado
      const idUsuario = this.authService.getUserId();

      this.bookigForm.patchValue({
      usuario: {
        idUsuario: idUsuario
      }
    });

      console.log("Form valido", this.bookigForm.value);
      const booking: BookingModel = this.bookigForm.value;
      console.log("fomulario enviado", booking);

      this.bookingService.add(booking).subscribe({
        next: (response) => {
          Swal.fire({
            title: "¡Registrada!",
            text: "La reserva se ha registrado correctamente.",
            icon: "success"
          });

          this.router.navigate(['/bookings']);
          //this.usuarioForm.reset();
        },
        error: (error) => {
          Swal.fire({
            title: "Error",
            // text: this.mensajeError = error.error,
            text: "Ha ocurrido un error",
            icon: "error"
          });
        }
      });
    }
  }

  mayorQueCheckIn(control: AbstractControl): ValidationErrors | null {
    const checkIn = control.get('checkIn')?.value;
    const checkOut = control.get('checkOut')?.value;

    if (!checkIn || !checkOut) return null;

    const fechaIn = new Date(checkIn);
    const fechaOut = new Date(checkOut);

    return fechaOut <= fechaIn ? { fechaInvalida: true } : null;
  }

  maximo30Dias(control: AbstractControl): ValidationErrors | null {
    const checkIn = control.get('checkIn')?.value;
    const checkOut = control.get('checkOut')?.value;

    if (!checkIn || !checkOut) return null;

    const fechaIn = new Date(checkIn);
    const fechaOut = new Date(checkOut);

    const dias = (fechaOut.getTime() - fechaIn.getTime()) / (1000 * 60 * 60 * 24);

    return dias > 30 ? { maxDias: true } : null;
  }

  validarFechas(control: AbstractControl): ValidationErrors | null {
    return {
      ...this.mayorQueCheckIn(control),
      ...this.maximo30Dias(control)
    };
  }

  tipoSeleccionado: string = '';

  filtrarPorTipo() {
    if (!this.tipoSeleccionado) {
      this.roomService.getAvailableRooms().subscribe(data => {
        this.rooms = data;
      });
    } else {
      this.roomService.getAvailableRoomsPerType(this.tipoSeleccionado).subscribe(data => {
        this.rooms = data;
      });
    }
  }

  limpiarFiltroTipo() {
    this.tipoSeleccionado = '';
    this.roomService.getAvailableRooms().subscribe(data => {
      this.rooms = data;
    })
  }

  calcularTotal() {
    const checkIn = this.bookigForm.get('checkIn')?.value;
    const checkOut = this.bookigForm.get('checkOut')?.value;
    const precio = Number(this.bookigForm.get('room.pricePerNight')?.value);

    if (checkIn && checkOut && precio) {
      const fecha1 = new Date(checkIn);
      const fecha2 = new Date(checkOut);

      const diferencia = fecha2.getTime() - fecha1.getTime();
      const noches = diferencia / (1000 * 60 * 60 * 24);

      if (noches > 0) {
        const total = noches * precio;

        this.bookigForm.patchValue({
          totalPrice: total
        });
      }
    }
  }

}
