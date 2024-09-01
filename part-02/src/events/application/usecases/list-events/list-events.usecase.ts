import { EventRepository } from "@events/application/repositories/event.repository";
import { Usecase } from "../usecase";
import { ListEventsBuildDto, ListEventsOutputDto } from "./list-events.dto";
import { Event } from "@events/application/domain/entities/event.entity";

export class ListEventsUsecase implements Usecase<void, ListEventsOutputDto> {
  private constructor(
    private readonly eventRepository: EventRepository
  ) { }

  public static build({
    eventRepository
  }: ListEventsBuildDto): ListEventsUsecase {
    return new ListEventsUsecase(eventRepository);
  }

  public async execute(): Promise<ListEventsOutputDto> {
    const events = await this.eventRepository.list();

    const output = this.toOutput(events);

    return output;
  }

  private toOutput(events: Event[]): ListEventsOutputDto {
    const output: ListEventsOutputDto = {
      events: events.map((event: Event) => ({
        id: event.id,
        name: event.name,
        price: event.price,
        totalCapacity: event.totalCapacity,
        availableCapacity: event.availableCapacity,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }))
    }

    return output;
  }
}