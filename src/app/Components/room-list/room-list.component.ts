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
  totalRecords: number = 0;

  page: number = 0;
  size = 10;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.cargarRooms();

  }

  cargarRooms() {
    this.roomService.getAll(this.page, this.size).subscribe(res => {
      this.rooms = res.data;
      this.totalRecords = res.total;
      console.log("Habitaciones cargadas", res.data);
      
    });
  }

  cambiarPagina(nuevaPagina: number) {
    this.page = nuevaPagina;
    this.cargarRooms();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.size);
  }

  eliminar(idRoom: number) {
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

  // filtro
  tipoSeleccionado: string = '';
  disponibleSeleccionado: boolean | null = null;

  filtrar() {
    this.rooms = [];
    this.roomService.getByFilters(this.tipoSeleccionado, this.disponibleSeleccionado).subscribe(data => {
      this.rooms = data;
    });
  }

  limpiarFiltro() {
    this.tipoSeleccionado = '';
    this.disponibleSeleccionado = null;
    this.cargarRooms();
  }
}
