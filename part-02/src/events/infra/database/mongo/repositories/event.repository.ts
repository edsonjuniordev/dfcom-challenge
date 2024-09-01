import { InjectModel } from "@nestjs/mongoose";
import { Event } from "@events/application/domain/entities/event.entity";
import { EventRepository } from "@events/application/repositories/event.repository";
import { Model } from "mongoose";
import { EventModel } from "../models/event.model";
import { EventEntityToModelMapper } from "./mappers/event-entity-to-model.mapper";
import { EventModelToEntity } from "./mappers/event-model-to-entity.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventMongoRepository implements EventRepository {
  constructor(
    @InjectModel(EventModel.name) private readonly eventModel: Model<EventModel>,
  ) { }

  public async create(event: Event): Promise<void> {
    const aModel = EventEntityToModelMapper.map(event);

    await this.eventModel.create(aModel);
  }

  public async list(): Promise<Event[]> {
    const models = await this.eventModel.find();

    const output = models.map((model) => EventModelToEntity.map(model));

    return output;
  }

  // Pessimistc lock strategy
  public async findByIdAndLock(eventId: string): Promise<Event> {
    const aModel = await this.eventModel.findOne({
      id: eventId
    });

    if (!aModel) {
      return null;
    }

    if (aModel.locked) {
      return this.findByIdAndLock(eventId);
    };

    aModel.locked = true;

    await aModel.save();

    const aEntity = EventModelToEntity.map(aModel);

    return aEntity;
  }

  public async update(event: Event): Promise<void> {
    const aModel = EventEntityToModelMapper.map(event);

    await this.eventModel.updateOne({
      id: event.id
    }, aModel);
  };

  public async unlock(eventId: string): Promise<void> {
    const aModel = await this.eventModel.findOne({
      id: eventId
    });

    aModel.locked = false;

    await aModel.save();
  }
}