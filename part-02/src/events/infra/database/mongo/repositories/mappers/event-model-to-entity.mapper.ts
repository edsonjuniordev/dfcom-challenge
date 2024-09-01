import { Event } from "@events/application/domain/entities/event.entity";
import { EventModel } from "../../models/event.model";

export class EventModelToEntity {
  public static map(eventModel: EventModel): Event {
    const aEntity = Event.with({
      id: eventModel.id,
      name: eventModel.name,
      price: eventModel.price,
      totalCapacity: eventModel.totalCapacity,
      availableCapacity: eventModel.availableCapacity,
      createdAt: eventModel.createdAt,
      updatedAt: eventModel.updatedAt
    });

    return aEntity;
  }
}