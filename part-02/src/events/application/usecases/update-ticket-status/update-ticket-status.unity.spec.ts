import { TicketProps, TicketStatus } from "@events/application/domain/entities/ticket.entity";
import { EventRepository } from "@events/application/repositories/event.repository";
import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { PaymentStatus, UpdateTicketStatusBuildDto, UpdateTicketStatusInputDto } from "./update-ticket-status.dto";
import { UpdateTicketStatusUsecase } from "./update-ticket-status.usecase";
import { UUIDGenerator } from "@shared/utils/uuid-generator";
import { EventProps } from "@events/application/domain/entities/event.entity";
import { DateGenerator } from "@shared/utils/date-generator";
import { UnityOfWork } from "@shared/unity-of-work/unity-of-work";

describe("update-ticket-status usecase", () => {
  let buildMock: UpdateTicketStatusBuildDto;
  let inputMock: UpdateTicketStatusInputDto;

  let eventRepositoryMock: EventRepository;
  let ticketRepositoryMock: TicketRepository;

  let ticketMock;
  let eventMock: EventProps;
  let unitOfWorkMock: UnityOfWork;

  beforeEach(() => {
    eventRepositoryMock = {
      create: jest.fn().mockResolvedValue(null),
      findByIdAndLock: jest.fn(),
      update: jest.fn(),
      unlock: jest.fn(),
      list: jest.fn(),
    };

    const now = DateGenerator.now();

    eventMock = {
      id: UUIDGenerator.generate(),
      name: "Event name",
      price: 1000,
      totalCapacity: 100,
      availableCapacity: 100,
      createdAt: now,
      updatedAt: now,
    }

    ticketMock = {
      id: UUIDGenerator.generate(),
      userId: UUIDGenerator.generate(),
      event: {
        ...eventMock,
        releaseTicketReservation: jest.fn(),
      },
      price: 1000,
      status: TicketStatus.CREATED,
      customerEmail: "email@example.com",
      createdAt: now,
      updatedAt: now,
      paid: jest.fn(),
      failed: jest.fn()
    }

    ticketRepositoryMock = {
      create: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(ticketMock),
      update: jest.fn(),
    }

    unitOfWorkMock = {
      abort: jest.fn().mockResolvedValue(null),
      addWork: jest.fn(),
      commit: jest.fn().mockResolvedValue(null),
      start: jest.fn().mockResolvedValue(null)
    }

    buildMock = {
      eventRepository: eventRepositoryMock,
      ticketRepository: ticketRepositoryMock,
      unityOfWork: unitOfWorkMock
    };

    inputMock = {
      status: PaymentStatus.PAID,
      ticketId: ticketMock.id
    };
  })

  describe("build", () => {
    it("should return an instance of UpdateTicketStatusUsecase", () => {
      const updateTicketStatusUsecase = UpdateTicketStatusUsecase.build(buildMock);

      expect(updateTicketStatusUsecase).toBeDefined();
      expect(updateTicketStatusUsecase).toBeInstanceOf(UpdateTicketStatusUsecase);
    })
  })

  describe("execute", () => {
    it("should update ticket status to PAID when passing a valid UpdateTicketStatusInputDto", async () => {
      const updateTicketStatusUsecase = UpdateTicketStatusUsecase.build(buildMock);

      await updateTicketStatusUsecase.execute(inputMock)

      expect(ticketRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(ticketMock.paid).toHaveBeenCalledTimes(1)
      expect(ticketRepositoryMock.update).toHaveBeenCalledTimes(1)
    });

    it("should update ticket status to FAILED when passing a valid UpdateTicketStatusInputDto", async () => {
      inputMock.status = PaymentStatus.FAILED;

      const updateTicketStatusUsecase = UpdateTicketStatusUsecase.build(buildMock);

      await updateTicketStatusUsecase.execute(inputMock)

      expect(ticketRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(ticketMock.failed).toHaveBeenCalledTimes(1)
      expect(ticketMock.event.releaseTicketReservation).toHaveBeenCalledTimes(1)
      expect(eventRepositoryMock.update).toHaveBeenCalledTimes(1)
      expect(ticketRepositoryMock.update).toHaveBeenCalledTimes(1)
    })
  })
})