import { Component } from '@angular/core';
import { RoomModel } from '../../Models/RoomModel';
import { RoomService } from '../../Service/room.service';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-room-list',
  standalone: false,
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  rooms: RoomModel[] = [];

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.cargarRooms();
    
  }

  cargarRooms() {
    this.roomService.getAll().subscribe(
      data => {
        this.rooms = data;
        console.log("Habitaciones cargadas");
      },
      error => {
        console.log("Error al obtener las habitaciones");
        
      });
  }

  eliminar(idRoom : number) {
    Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir este proceso",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, elimínalo!",
    cancelButtonText: "Cancelar"
  }).then((result: any) => {
    if (result.isConfirmed) {
      this.roomService.delete(idRoom).subscribe(() => {
        Swal.fire({
          title: "¡Eliminado!",
          text: "La habitación ha sido eliminado satisfactoriamente.",
          icon: "success"
          // timer: 2000
        });
        // Recargar lista después de eliminar
        this.cargarRooms();
      }, error => {
        Swal.fire({
          title: "Error",
          text: error.error || "No se pudo eliminar la habitación.",
          icon: "error"
        });
      });
    }
  });
  }
}
