import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../Service/room.service';

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


}
