import { EventProps } from "@events/application/domain/entities/event.entity";
import { TicketStatus } from "@events/application/domain/entities/ticket.entity";
import { Messaging } from "@events/application/messaging/messaging";
import { EventRepository } from "@events/application/repositories/event.repository";
import { TicketRepository } from "@events/application/repositories/ticket.repository";

export enum PaymentMethod {
  CARD = 'CARD',
  PIX = 'PIX',
}

export type CreateTicketBuildDto = {
  eventRepository: EventRepository;
  ticketRepository: TicketRepository;
  messaging: Messaging;
}

export type CreateTicketInputDto = {
  userId: string;
  eventId: string;
  customerEmail: string;
};

export type CreateTicketOutputDto = {
  id: string;
  userId: string;
  price: number;
  event: EventProps;
  status: TicketStatus;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}