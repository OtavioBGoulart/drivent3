import { Hotel } from "@prisma/client";
import { prisma } from "@/config";

export async  function createHotels() : Promise<Hotel> {
    return await prisma.hotel.create({
        data: {
            name: "Plaza",
            image: "https://images3.motor-reserva.com.br/cdn-cgi/image/fit=scale-down,format=webp,width=640,quality=75/curl/motor_reserva/images/configuracao_estabelecimento/cliente_572/202111051636144570fotoohotel.jpg"
        }
    })
}

export async function createRoom(hotelId: number) {
    return await prisma.room.create({
        data: {
            name: "Suite",
            capacity: 2,
            hotelId
        }
    })
}