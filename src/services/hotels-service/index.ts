import { notFoundError, PaymentRequired } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { hotelsRepository } from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import { ParamsDictionary } from "express-serve-static-core";


export async function getHotelsService(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }
    if (!ticket.TicketType.includesHotel 
    || ticket.TicketType.isRemote) {
        throw PaymentRequired();
    }
    const hotels = await hotelsRepository.findHotels();
    
    return hotels;
}

export async function getHotelByIdService(userId: number, hotelId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }
    if (!ticket.TicketType.includesHotel 
    || ticket.TicketType.isRemote) {
        throw PaymentRequired();
    }
    console.log("oi")

    const hotel = await hotelsRepository.findHotelWithRooms(hotelId);
    console.log(hotel)
    if (!hotel) throw notFoundError();

    console.log("opa")

    return hotel;
}