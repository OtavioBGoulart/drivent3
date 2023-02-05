import { notFoundError, PaymentRequired } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

export async function getHotelsService(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }
    if (ticket.status === "RESERVED" || !ticket.TicketType.includesHotel 
    || !ticket.TicketType.isRemote) {
        throw PaymentRequired();
    }
    
    return ticket;
}