import { AuthenticatedRequest } from "@/middlewares";
import { getHotelsService } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const hotels = await getHotelsService(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        console.log(error);
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send({error})
        }
        if (error.name === "PaymentRequired") {
            return res.status(httpStatus.PAYMENT_REQUIRED).send({error})
        }
    }
}