import { Ticket } from "@events/application/domain/entities/ticket.entity";

export interface Messaging {
  sendTicketCreatedEvent(ticket: Ticket): Promise<void>;
}