import { notFoundError, PaymentRequired } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { hotelsRepository } from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import { number } from "joi";

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
    const hotel = await hotelsRepository.findHoltelWithRooms(hotelId)
}