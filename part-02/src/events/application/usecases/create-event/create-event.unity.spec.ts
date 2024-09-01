import { CreateEventUsecase } from "./create-event.usecase"
import { CreateEventBuildDto, CreateEventInputDto, CreateEventOutputDto } from "./create-event.dto";
import { DateGenerator } from "@events/utils/date-generator";
import { EventRepository } from "@events/application/repositories/event.repository";

describe("create-event usecase", () => {
  let buildMock: CreateEventBuildDto;
  let inputMock: CreateEventInputDto;
  let outputMock: CreateEventOutputDto;

  let eventRepositoryMock: EventRepository;

  beforeEach(() => {
    eventRepositoryMock = {
      create: jest.fn().mockResolvedValue(null),
      findByIdAndLock: jest.fn(),
      update: jest.fn(),
      unlock: jest.fn(),
      list: jest.fn(),
    };

    buildMock = {
      eventRepository: eventRepositoryMock
    };

    inputMock = {
      name: "Event name",
      price: 1000,
      totalCapacity: 100
    };

    const now = DateGenerator.now();

    outputMock = {
      id: "5a82ce19-9182-4ace-acdf-c6b192aee888",
      name: "Event name",
      price: 1000,
      totalCapacity: 100,
      availableCapacity: 100,
      createdAt: now,
      updatedAt: now,
    }
  })

  describe("build", () => {
    it("should return an instance of CreateEventUsecase", () => {
      const createEventUsecase = CreateEventUsecase.build(buildMock);

      expect(createEventUsecase).toBeDefined();
      expect(createEventUsecase).toBeInstanceOf(CreateEventUsecase);
    })
  })

  describe("execute", () => {
    it("should return a CreateEventOutputDto when passing a valid CreateEventInputDto", async () => {
      const createEventUsecase = CreateEventUsecase.build(buildMock);

      const output = await createEventUsecase.execute(inputMock)

      output.id = outputMock.id;
      output.createdAt = outputMock.createdAt;
      output.updatedAt = outputMock.updatedAt;

      expect(output).toBeDefined()
      expect(output).toEqual(outputMock)
      expect(eventRepositoryMock.create).toHaveBeenCalledTimes(1)
    })
  })
})