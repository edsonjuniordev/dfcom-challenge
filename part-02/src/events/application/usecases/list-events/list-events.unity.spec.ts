import { EventRepository } from "@events/application/repositories/event.repository";
import { ListEventsBuildDto, ListEventsOutputDto } from "./list-events.dto";
import { DateGenerator } from "@shared/utils/date-generator";
import { ListEventsUsecase } from "./list-events.usecase";
import { EventProps } from "@events/application/domain/entities/event.entity";

describe("list-event usecase", () => {
  let buildMock: ListEventsBuildDto;
  let outputMock: ListEventsOutputDto;
  let eventMock: EventProps;

  let eventRepositoryMock: EventRepository;

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

    eventRepositoryMock = {
      create: jest.fn(),
      findByIdAndLock: jest.fn(),
      update: jest.fn(),
      unlock: jest.fn(),
      list: jest.fn().mockResolvedValue([eventMock]),
    };

    buildMock = {
      eventRepository: eventRepositoryMock
    };

    outputMock = {
      events: [eventMock]
    }
  })

  describe("build", () => {
    it("should return an instance of ListEventsUsecase", () => {
      const listEventsUsecase = ListEventsUsecase.build(buildMock);

      expect(listEventsUsecase).toBeDefined();
      expect(listEventsUsecase).toBeInstanceOf(ListEventsUsecase);
    })
  })

  describe("execute", () => {
    it("should return a ListEventsOutputDto when passing a valid ListEventsInputDto", async () => {
      const listEventsUsecase = ListEventsUsecase.build(buildMock);

      const output = await listEventsUsecase.execute();

      output.events[0].id = outputMock.events[0].id;
      output.events[0].createdAt = outputMock.events[0].createdAt;
      output.events[0].updatedAt = outputMock.events[0].updatedAt;

      expect(output).toBeDefined()
      expect(output).toEqual(outputMock)
      expect(eventRepositoryMock.list).toHaveBeenCalledTimes(1)
    })
  })
})