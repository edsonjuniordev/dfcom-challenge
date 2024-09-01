import { Event } from "@events/application/domain/entities/event.entity";
import { EventModel } from "../../models/event.model";

export class EventEntityToModelMapper {
  public static map(event: Event): EventModel {
    const aModel: EventModel = {
      id: event.id,
      name: event.name,
      price: event.price,
      totalCapacity: event.totalCapacity,
      availableCapacity: event.availableCapacity,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    return aModel;
  }
}