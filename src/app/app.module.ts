import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomListComponent } from './Components/room-list/room-list.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RoomFormComponent } from './Components/room-form/room-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookingListComponent } from './Components/booking-list/booking-list.component';
import { BookingFormComponent } from './Components/booking-form/booking-form.component';


@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    RoomFormComponent,
    BookingListComponent,
    BookingFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
