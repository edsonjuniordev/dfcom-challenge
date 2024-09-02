import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { Work } from "../../../shared/unity-of-work/unity-of-work";

export interface TicketRepository {
  create(ticket: Ticket): Work;
  findById(ticketId: string): Promise<Ticket>;
  update(ticket: Ticket): Work;
};