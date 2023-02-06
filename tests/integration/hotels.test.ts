import app, { init } from "@/app";
import { prisma } from "@/config";
import { createEnrollmentWithAddress, createTicketType, createUser, createTicket, createHotels, findHotels } from "../factories";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";


beforeAll(async () => {
    await init();
    await cleanDb();
});

beforeEach(async () => {
    await cleanDb();
});

afterAll(async () => {
    await cleanDb();
})

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user doesnt have a ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
      
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
        
        it("should respond with status 402 when user didnt paid for the ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        })

        it("should respond with status 402 when event is remote", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        })

        it("should respond with status 402 when event doesnt include hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        })

        it("should respond with status 200 and a empty body when user didnt paid for the ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            //const hotels = await findHotels();
            //const hotels = await createHotels();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual([])
        })

        it("should respond with status 200 when user didnt paid for the ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            //const hotels = await findHotels();
            const hotels = await createHotels();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual([
                {
                    id: hotels.id,
                    name: hotels.name,
                    image: hotels.image,
                    createdAt: hotels.createdAt.toISOString(),
                    updatedAt: hotels.updatedAt.toISOString(),
                },
            ])
        })
    })
})

// describe("GET /hotels:hotelId", () => {
//     it("Should respond with status 401 if no token is given", async () => {
//         const response = await server.get("/hotels/:hotelId");

//         expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//     })

//     it("should respond with status 401 if given token is not valid", async () => {
//         const token = faker.lorem.word();

//         const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//         expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//     });

//     it("should respond with status 401 if there is no session for given token", async () => {
//         const userWithoutSession = await createUser();
//         const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//         const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//         expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//     });

//     describe("when token is valid", () => {
//         it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
//             const token = await generateValidToken();

//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toEqual(httpStatus.NOT_FOUND);
//         });

//         it("should respond with status 404 when user doesnt have a ticket yet", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             await createEnrollmentWithAddress(user);
      
//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
      
//             expect(response.status).toEqual(httpStatus.NOT_FOUND);
//           });
        
//         it("should respond with status 402 when user didnt paid for the ticket yet", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            
//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
//         })

//         it("should respond with status 402 when event is remote", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketType(false, false);
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            
//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
//         })

//         it("should respond with status 402 when event doesnt include hotel", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketType(true, false);
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            
//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
//         })

//         it("should respond with status 404 when hotel was not found", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketType(false, true);
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             //const hotels = await findHotels();
//             //const hotels = await createHotels();

//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toBe(httpStatus.OK);
//             expect(response.body).toEqual([])
//         })

//         it("should respond with status 200 when user didnt paid for the ticket yet", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketType(false, true);
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             //const hotels = await findHotels();
//             const hotels = await createHotels();

//             const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toBe(httpStatus.OK);
//             expect(response.body).toEqual([
//                 {
//                     id: hotels.id,
//                     name: hotels.name,
//                     image: hotels.image,
//                     createdAt: hotels.createdAt.toISOString(),
//                     updatedAt: hotels.updatedAt.toISOString(),
//                 },
//             ])
//         })
//     })
// })

