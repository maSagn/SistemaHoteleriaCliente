export interface RoomModel {
    idRoom: number,
    roomNumber: string,
    type: string,
    pricePerNight: number,
    isAvailable: boolean,
    maxGuests: number,
    description: string
}