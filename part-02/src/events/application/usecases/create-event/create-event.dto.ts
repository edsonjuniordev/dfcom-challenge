import { EventRepository } from "@events/application/repositories/event.repository";

export type CreateEventBuildDto = {
  eventRepository: EventRepository;
}

export type CreateEventInputDto = {
  name: string;
  price: number;
  totalCapacity: number;
};

export type CreateEventOutputDto = {
  id: string;
  name: string;
  price: number;
  totalCapacity: number;
  availableCapacity: number;
  createdAt: string;
  updatedAt: string;
}