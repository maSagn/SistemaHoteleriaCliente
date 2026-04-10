import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomListComponent } from './Components/room-list/room-list.component';
import { RoomFormComponent } from './Components/room-form/room-form.component';

const routes: Routes = [
  { path: 'rooms', component: RoomListComponent },
  { path: 'room', component: RoomFormComponent },
  { path: 'room/:id', component: RoomFormComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
