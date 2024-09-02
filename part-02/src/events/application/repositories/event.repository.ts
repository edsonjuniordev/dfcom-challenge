import { Event } from "@events/application/domain/entities/event.entity";
import { Work } from "../../../shared/unity-of-work/unity-of-work";

export interface EventRepository {
  create(event: Event): Promise<void>;
  list(): Promise<Event[]>;
  findByIdAndLock(eventId: string): Promise<Event>;
  unlock(eventId: string): Promise<void>;
  update(event: Event): Work;
}