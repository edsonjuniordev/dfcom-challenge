import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { Types } from "mongoose";
import { TicketModel } from "../../models/ticket.model";

export class TicketEntityToModelMapper {
  public static map(ticket: Ticket, eventId: Types.ObjectId): TicketModel {
    const aModel: TicketModel = {
      id: ticket.id,
      userId: ticket.userId,
      event: eventId,
      price: ticket.price,
      status: ticket.status,
      customerEmail: ticket.customerEmail,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }

    return aModel;
  }
}