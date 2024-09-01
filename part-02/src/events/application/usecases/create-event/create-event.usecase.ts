import { EventRepository } from "@events/application/repositories/event.repository";
import { Usecase } from "../usecase";
import { CreateEventBuildDto, CreateEventInputDto, CreateEventOutputDto } from "./create-event.dto";
import { Event } from "@events/application/domain/entities/event.entity";

export class CreateEventUsecase implements Usecase<CreateEventInputDto, CreateEventOutputDto> {
  private constructor(
    private readonly eventRepository: EventRepository
  ) { }

  public static build({
    eventRepository
  }: CreateEventBuildDto): CreateEventUsecase {
    return new CreateEventUsecase(eventRepository);
  }

  public async execute({
    name,
    price,
    totalCapacity
  }: CreateEventInputDto): Promise<CreateEventOutputDto> {
    const event = Event.create({
      name,
      price,
      totalCapacity
    });

    await this.eventRepository.create(event);

    const output = event.toDto();

    return output;
  }
}