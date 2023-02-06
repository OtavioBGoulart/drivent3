import { AuthenticatedRequest } from "@/middlewares";
import { getHotelByIdService, getHotelsService } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const hotels = await getHotelsService(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send({error})
        }
        if (error.name === "PaymentRequired") {
            return res.status(httpStatus.PAYMENT_REQUIRED).send({error})
        }
    }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotelId  = Number(req.params.hotelId);
    console.log(hotelId)


    try {
        const hotel = await getHotelByIdService(userId, hotelId)
        return res.status(httpStatus.OK).send(hotel)
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send({error})
        }
        if (error.name === "PaymentRequired") {
            return res.status(httpStatus.PAYMENT_REQUIRED).send({error})
        }
    }
}