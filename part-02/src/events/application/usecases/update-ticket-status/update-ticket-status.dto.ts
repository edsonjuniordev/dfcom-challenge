import { EventRepository } from "@events/application/repositories/event.repository";
import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { UnityOfWork } from "@shared/unity-of-work/unity-of-work";

export type UpdateTicketStatusBuildDto = {
  ticketRepository: TicketRepository;
  eventRepository: EventRepository;
  unityOfWork: UnityOfWork;
}

export enum PaymentStatus {
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export type UpdateTicketStatusInputDto = {
  ticketId: string;
  status: PaymentStatus;
};

export type UpdateTicketStatusOutputDto = void;