import { RoomModel } from "./RoomModel";

export interface BookingModel {
    idBooking: number,
    guestName: string,
    guestEmail: string,
    checkIn: Date,
    checkOut: Date,
    totalPrice: number,
    status: string,
    room: RoomModel
}