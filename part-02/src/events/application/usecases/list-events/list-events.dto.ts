import { EventRepository } from "@events/application/repositories/event.repository";

export type ListEventsBuildDto = {
  eventRepository: EventRepository;
}

export type ListEventsOutputDto = {
  events: {
    id: string;
    name: string;
    price: number;
    totalCapacity: number;
    availableCapacity: number;
    createdAt: string;
    updatedAt: string;
  }[]
}