import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { Work } from "@shared/unity-of-work/unity-of-work";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { EventModel } from "../models/event.model";
import { TicketModel } from "../models/ticket.model";
import { TicketEntityToModelMapper } from "./mappers/ticket-entity-to-model.mapper";
import { TicketModelToEntity } from "./mappers/ticket-model-to-entity.mapper";

@Injectable()
export class TicketMongoRepository implements TicketRepository {
  constructor(
    @InjectModel(TicketModel.name) private readonly ticketModel: Model<TicketModel>,
    @InjectModel(EventModel.name) private readonly eventModel: Model<EventModel>,
  ) { }

  public create(ticket: Ticket): Work {
    const work = async (session: ClientSession) => {
      const event = await this.eventModel.findOne({
        id: ticket.event.id,
      });

      const aModel = TicketEntityToModelMapper.map(ticket, event._id);

      await this.ticketModel.create([aModel], {
        session
      });
    }

    return work;
  }

  public async findById(ticketId: string): Promise<Ticket> {
    const aModel = await this.ticketModel.findOne({
      id: ticketId
    });

    const eventModel = await this.eventModel.findById(aModel?.event);

    const aEntity = TicketModelToEntity.map(aModel, eventModel);

    return aEntity;
  };

  public update(ticket: Ticket): Work {
    const work = async (session: ClientSession) => {
      const event = await this.eventModel.findOne({
        id: ticket.event.id
      });
  
      const aModel = TicketEntityToModelMapper.map(ticket, event._id);
  
      await this.ticketModel.updateOne({
        id: ticket.id
      }, aModel, {
        session
      });
    }

    return work;
  }
}