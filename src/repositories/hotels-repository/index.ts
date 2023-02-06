import { prisma } from "@/config";
import { ParamsDictionary } from "express-serve-static-core";

async function findHotels() {
    return prisma.hotel.findMany();
}

async function findHoltelWithRooms(hotelId: ParamsDictionary) {
    return await prisma.hotel.findFirst({
        where: { id: hotelId },
        include: {
            Rooms: true
        }
    })
}

export const hotelsRepository = {
    findHotels,
    findHoltelWithRooms
}