import { Event } from "@events/application/domain/entities/event.entity";

export interface EventRepository {
  create(event: Event): Promise<void>;
  list(): Promise<Event[]>;
  findByIdAndLock(eventId: string): Promise<Event>;
  unlock(eventId: string): Promise<void>;
  update(event: Event): Promise<void>;
}