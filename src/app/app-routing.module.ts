import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomListComponent } from './Components/room-list/room-list.component';
import { RoomFormComponent } from './Components/room-form/room-form.component';
import { BookingListComponent } from './Components/booking-list/booking-list.component';
import { BookingFormComponent } from './Components/booking-form/booking-form.component';
import { LoginComponent } from './Components/login/login.component';
import { authGuard } from './Guards/auth.guard';
import { AccessDeniedComponent } from './Components/access-denied/access-denied.component';
import { functionalGuard } from './Guards/functional.guard';

const routes: Routes = [
  { path: 'rooms', component: RoomListComponent, canActivate: [authGuard, functionalGuard], },
  { path: 'room', component: RoomFormComponent, canActivate: [authGuard] },
  { path: 'room/:id', component: RoomFormComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingListComponent, canActivate: [authGuard] },
  { path: 'booking', component: BookingFormComponent, canActivate: [authGuard]},
  { path: 'booking/:id', component: BookingFormComponent, canActivate: [authGuard] },
  { path: '403', component: AccessDeniedComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
