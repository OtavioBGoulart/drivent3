import { prisma } from "@/config";

async function findHotels() {
    return prisma.hotel.findMany();
}

export const hotelsRepository = {
    findHotels
}