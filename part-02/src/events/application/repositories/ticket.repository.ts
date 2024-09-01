import { Ticket } from "@events/application/domain/entities/ticket.entity";

export interface TicketRepository {
  create(ticket: Ticket): Promise<void>;
};