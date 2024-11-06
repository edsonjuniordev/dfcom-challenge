import { EventRepository } from "@events/application/repositories/event.repository";
import { Usecase } from "../usecase";
import { CreateTicketBuildDto, CreateTicketInputDto, CreateTicketOutputDto } from "./create-ticket.dto";
import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { Messaging } from "@events/application/messaging/messaging";
import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { UnityOfWork } from "@shared/unity-of-work/unity-of-work";

export class CreateTicketUsecase implements Usecase<CreateTicketInputDto, CreateTicketOutputDto> {
  private constructor(
    private readonly eventRepository: EventRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly messaging: Messaging,
    private readonly unityOfWork: UnityOfWork,
  ) { }

  public static build({
    eventRepository,
    ticketRepository,
    messaging,
    unityOfWork
  }: CreateTicketBuildDto): CreateTicketUsecase {
    return new CreateTicketUsecase(eventRepository, ticketRepository, messaging, unityOfWork);
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
      await this.eventRepository.unlock(eventId);
      throw new Error(`Event ${eventId} is full`);
    }

    try {
      await this.unityOfWork.start();

      event.ticketReservation();

      const updateEventWork = this.eventRepository.update(event);
      this.unityOfWork.addWork(updateEventWork);

      const ticket = Ticket.create({
        userId,
        price: event.price,
        event,
        customerEmail,
      });

      const createTicketWork = this.ticketRepository.create(ticket);
      this.unityOfWork.addWork(createTicketWork);
      
      await this.unityOfWork.commit();

      await this.messaging.sendTicketCreatedEvent(ticket);
      
      const output = this.toOutput(ticket);

      return output;
    } catch (error) {
      console.log("🚀 ~ CreateTicketUsecase error:", error)

      await this.unityOfWork.abort();
      
      throw new Error(`Something went wrong while creating ticket for event ${eventId} - ${error.message}`);
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
