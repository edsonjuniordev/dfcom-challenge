import { EventRepository } from "@events/application/repositories/event.repository";
import { Usecase } from "../usecase";
import { CreateTicketBuildDto, CreateTicketInputDto, CreateTicketOutputDto } from "./create-ticket.dto";
import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { Messaging } from "@events/application/messaging/messaging";
import { TicketRepository } from "@events/application/repositories/ticket.repository";

export class CreateTicketUsecase implements Usecase<CreateTicketInputDto, CreateTicketOutputDto> {
  private constructor(
    private readonly eventRepository: EventRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly messaging: Messaging
  ) { }

  public static build({
    eventRepository,
    ticketRepository,
    messaging
  }: CreateTicketBuildDto): CreateTicketUsecase {
    return new CreateTicketUsecase(eventRepository, ticketRepository, messaging);
  }

  public async execute({
    userId,
    eventId,
    customerEmail,
  }: CreateTicketInputDto): Promise<CreateTicketOutputDto> {
    const event = await this.eventRepository.findByIdAndLock(eventId);

    if (!event) {
      throw new Error(`Event ${eventId} not found while creating ticket`);
    }

    if (event.isFull()) {
      throw new Error(`Event ${eventId} is full`);
    }

    try {
      event.ticketReservation();

      await this.eventRepository.update(event);

      const ticket = Ticket.create({
        userId,
        price: event.price,
        event,
        customerEmail,
      });

      await this.ticketRepository.create(ticket);

      await this.messaging.sendTicketCreatedEvent(ticket);

      const output = this.toOutput(ticket);

      return output;
    } catch (error) {
      event.releaseTicketReservation();
      await this.eventRepository.update(event);
      
      throw new Error(`Something went wrong while creating ticket for event ${eventId}`);
    } finally {
      await this.eventRepository.unlock(eventId);
    }
  }

  private toOutput(ticket: Ticket): CreateTicketOutputDto {
    const output: CreateTicketOutputDto = {
      id: ticket.id,
      userId: ticket.userId,
      price: ticket.price,
      event: ticket.event.toDto(),
      status: ticket.status,
      customerEmail: ticket.customerEmail,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    return output;
  }
}