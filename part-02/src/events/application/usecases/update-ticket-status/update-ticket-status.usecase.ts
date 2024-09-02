import { TicketRepository } from "@events/application/repositories/ticket.repository";
import { Usecase } from "../usecase";
import { PaymentStatus, UpdateTicketStatusBuildDto, UpdateTicketStatusInputDto, UpdateTicketStatusOutputDto } from "./update-ticket-status.dto";
import { EventRepository } from "@events/application/repositories/event.repository";
import { UnityOfWork } from "@shared/unity-of-work/unity-of-work";

export class UpdateTicketStatusUsecase implements Usecase<UpdateTicketStatusInputDto, UpdateTicketStatusOutputDto> {
  private constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly eventRepository: EventRepository,
    private readonly unityOfWork: UnityOfWork,
  ) { }

  public static build({
    ticketRepository,
    eventRepository,
    unityOfWork
  }: UpdateTicketStatusBuildDto): UpdateTicketStatusUsecase {
    return new UpdateTicketStatusUsecase(ticketRepository, eventRepository, unityOfWork);
  }

  public async execute({
    ticketId,
    status
  }: UpdateTicketStatusInputDto): Promise<UpdateTicketStatusOutputDto> {
    try {
      await this.unityOfWork.start();

      const ticket = await this.ticketRepository.findById(ticketId);

      if (status === PaymentStatus.PAID) {
        ticket.paid();
      }
  
      if (status === PaymentStatus.FAILED) {
        ticket.failed();
        ticket.event.releaseTicketReservation();
        const updateEventWork = this.eventRepository.update(ticket.event);
        this.unityOfWork.addWork(updateEventWork);
      }
  
      const updateTicketWork = this.ticketRepository.update(ticket);
      this.unityOfWork.addWork(updateTicketWork);

      await this.unityOfWork.commit();
    } catch (error) {
      console.log("🚀 ~ UpdateTicketStatusUsecase error:", error)

      await this.unityOfWork.abort();
    }
  }
}