import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TicketModel } from "../models/ticket.model";
import { Model } from "mongoose";
import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { EventModel } from "../models/event.model";
import { TicketEntityToModelMapper } from "./mappers/ticket-entity-to-model.mapper";

@Injectable()
export class TicketMongoRepository implements TicketRepository {
  constructor(
    @InjectModel(TicketModel.name) private readonly ticketModel: Model<TicketModel>,
    @InjectModel(EventModel.name) private readonly eventModel: Model<EventModel>,
  ) { }

  public async create(ticket: Ticket): Promise<void> {
    const event = await this.eventModel.findOne({
      id: ticket.event.id
    });

    const aModel = TicketEntityToModelMapper.map(ticket, event._id);

    await this.ticketModel.create(aModel);
  }
}