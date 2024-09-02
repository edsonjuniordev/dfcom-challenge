import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { TicketModel } from "../../models/ticket.model";
import { EventModel } from "../../models/event.model";

export class TicketModelToEntity {
  public static map(
    ticketModel: TicketModel,
    eventModel: EventModel
  ): Ticket {
    const aEntity = Ticket.with({
      id: ticketModel.id,
      userId: ticketModel.userId,
      event: eventModel,
      price: ticketModel.price,
      status: ticketModel.status,
      customerEmail: ticketModel.customerEmail,
      createdAt: ticketModel.createdAt,
      updatedAt: ticketModel.updatedAt,
    });

    return aEntity;
  }
}