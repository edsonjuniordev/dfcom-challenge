import { EventProps } from "@events/application/domain/entities/event.entity";
import { TicketStatus } from "@events/application/domain/entities/ticket.entity";
import { Messaging } from "@events/application/messaging/messaging";
import { EventRepository } from "@events/application/repositories/event.repository";
import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { UnityOfWork } from "@shared/unity-of-work/unity-of-work";

export type CreateTicketBuildDto = {
  eventRepository: EventRepository;
  ticketRepository: TicketRepository;
  messaging: Messaging;
  unityOfWork: UnityOfWork;
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