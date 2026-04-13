import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../Service/room.service';
import { RoomModel } from '../../Models/RoomModel';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-room-form',
  standalone: false,
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent {
  roomForm!: FormGroup;
  idRoom!: number | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      idRoom: [''],
      roomNumber: [''],
      type: [''],
      pricePerNight: [''],
      isAvailable: [''],
      maxGuests: [''],
      description: ['']
    });

    // Revisar si hay un id en la ruta
    this.idRoom = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idRoom) {
      this.roomService.getById(this.idRoom).subscribe(room => {
        this.roomForm.patchValue({
          idRoom: room.idRoom,
          roomNumber: room.roomNumber,
          type: room.type,
          pricePerNight: room.pricePerNight,
          isAvailable: room.isAvailable,
          maxGuests: room.maxGuests,
          description: room.description
        });
      });
    }
  }

  mensajeError: string = '';

  guardar() {
    if (this.roomForm.valid) {
      console.log("Form valido", this.roomForm.value);
      const room: RoomModel = this.roomForm.value;
      console.log("fomulario enviado", room);

      if (this.idRoom) { // Editar
        this.roomService.update(room, this.idRoom).subscribe(() => {

          Swal.fire({
            title: "¡Actualizada!",
            text: "La habitacion se ha actualizado exitosamente.",
            icon: "success"
          });

          this.router.navigate(['/rooms']);
        })

      } else { // Agregar
        this.roomService.add(room).subscribe({
          next: (response) => {
            Swal.fire({
              title: "¡Registrada!",
              text: "La habitación se ha registrado correctamente.",
              icon: "success"
            });

            this.router.navigate(['/rooms']);
            //this.usuarioForm.reset();
          },
          error: (error) => {
            Swal.fire({
              title: "Correo existente",
              text: this.mensajeError = error.error,
              icon: "error"
            });
          }
        });
      }
    }
  }
}
