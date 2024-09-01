import { DateGenerator } from "@events/utils/date-generator";
import { EventRepository } from "@events/application/repositories/event.repository";
import { CreateTicketBuildDto, CreateTicketInputDto, CreateTicketOutputDto } from "./create-ticket.dto";
import { Messaging } from "@events/application/messaging/messaging";
import { TicketStatus } from "@events/application/domain/entities/ticket.entity";
import { CreateTicketUsecase } from "./create-ticket.usecase";
import { EventProps } from "@events/application/domain/entities/event.entity";
import { TicketRepository } from "@events/application/repositories/ticket.repository";

describe("create-ticket usecase", () => {
  let buildMock: CreateTicketBuildDto;
  let inputMock: CreateTicketInputDto;
  let outputMock: CreateTicketOutputDto;

  let eventMock: EventProps;

  let eventRepositoryMock: EventRepository;
  let ticketRepositoryMock: TicketRepository;
  let messagingMock: Messaging;

  beforeEach(() => {
    const now = DateGenerator.now();

    eventMock = {
      id: "a1164523-c753-465d-8cfc-ae0cb86b5256",
      name: "Event name",
      price: 1000,
      totalCapacity: 100,
      availableCapacity: 100,
      createdAt: now,
      updatedAt: now,
    }

    inputMock = {
      userId: "aa0ab11e-3008-4f01-8716-8ef904a75a44",
      eventId: "a1164523-c753-465d-8cfc-ae0cb86b5256",
      customerEmail: "email@example.com",
    };

    outputMock = {
      id: "2d44fd04-300c-47ff-8ed1-69fd4596741a",
      userId: "aa0ab11e-3008-4f01-8716-8ef904a75a44",
      price: 1000,
      event: eventMock,
      status: TicketStatus.CREATED,
      customerEmail: "email@example.com",
      createdAt: now,
      updatedAt: now,
    }

    eventRepositoryMock = {
      create: jest.fn(),
      findByIdAndLock: jest.fn().mockResolvedValue({
        ...eventMock,
        isFull: () => {
          return false;
        },
        toDto: () => {
          return eventMock
        },
        ticketReservation: () => null,
        releaseTicketReservation: () => null,
      }),
      update: jest.fn().mockResolvedValue(null),
      unlock: jest.fn().mockResolvedValue(null),
      list: jest.fn().mockResolvedValue(null)
    };

    ticketRepositoryMock = {
      create: jest.fn().mockResolvedValue(null)
    }

    messagingMock = {
      sendTicketCreatedEvent: jest.fn().mockResolvedValue(null)
    }

    buildMock = {
      eventRepository: eventRepositoryMock,
      ticketRepository: ticketRepositoryMock,
      messaging: messagingMock
    };
  })

  describe("build", () => {
    it("should return an instance of CreateTicketUsecase", () => {
      const createTicketUsecase = CreateTicketUsecase.build(buildMock);

      expect(createTicketUsecase).toBeDefined();
      expect(createTicketUsecase).toBeInstanceOf(CreateTicketUsecase);
    })
  })

  describe("execute", () => {
    it("should return a CreateTicketOutputDto when passing a valid CreateTicketInputDto", async () => {
      const createTicketUsecase = CreateTicketUsecase.build(buildMock);

      const output = await createTicketUsecase.execute(inputMock)

      output.id = outputMock.id;
      output.createdAt = outputMock.createdAt;
      output.updatedAt = outputMock.updatedAt;

      expect(output).toBeDefined()
      expect(output).toEqual(outputMock)
      expect(eventRepositoryMock.update).toHaveBeenCalledTimes(1)
      expect(ticketRepositoryMock.create).toHaveBeenCalledTimes(1)
      expect(messagingMock.sendTicketCreatedEvent).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception of event not found", async () => {
      eventRepositoryMock.findByIdAndLock = jest.fn().mockResolvedValue(null);

      const createTicketUsecase = CreateTicketUsecase.build(buildMock);

      expect(createTicketUsecase.execute(inputMock)).rejects.toThrow(`Event ${inputMock.eventId} not found while creating ticket`);
    })

    it("should throw an exception of event is full", async () => {
      eventRepositoryMock.findByIdAndLock = jest.fn().mockResolvedValue({
        ...eventMock,
        isFull: () => {
          return true;
        },
        toDto: () => {
          return eventMock
        }
      });

      const createTicketUsecase = CreateTicketUsecase.build(buildMock);

      expect(createTicketUsecase.execute(inputMock)).rejects.toThrow(`Event ${inputMock.eventId} is full`);
    })

    it("should throw an exception", async () => {
      jest.spyOn(ticketRepositoryMock, "create").mockRejectedValueOnce(new Error());

      const createTicketUsecase = CreateTicketUsecase.build(buildMock);

      expect(createTicketUsecase.execute(inputMock)).rejects.toThrow(`Something went wrong while creating ticket for event ${inputMock.eventId}`);
    })
  })

})