import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomListComponent } from './Components/room-list/room-list.component';
import { RoomFormComponent } from './Components/room-form/room-form.component';
import { BookingListComponent } from './Components/booking-list/booking-list.component';
import { BookingFormComponent } from './Components/booking-form/booking-form.component';

const routes: Routes = [
  { path: 'rooms', component: RoomListComponent },
  { path: 'room', component: RoomFormComponent },
  { path: 'room/:id', component: RoomFormComponent },
  { path: 'bookings', component: BookingListComponent },
  { path: 'booking', component: BookingFormComponent},
  { path: 'booking/:id', component: BookingFormComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
