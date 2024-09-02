import { UpdateTicketStatusUsecase } from "@events/application/usecases/update-ticket-status/update-ticket-status.usecase"
import { Injectable } from "@nestjs/common"
import { EventMongoRepository } from "../database/mongo/repositories/event.repository"
import { TicketMongoRepository } from "../database/mongo/repositories/ticket.repository"
import { UpdateTicketStatusInputDto, UpdateTicketStatusOutputDto } from "@events/application/usecases/update-ticket-status/update-ticket-status.dto"
import { MongoUnityOfWork } from "@shared/database/mongo/unity-of-work/unity-of-work.mongo"

@Injectable()
export class UpdateTicketStatusUsecaseProvider {
  private useCase: UpdateTicketStatusUsecase

  constructor(
    private readonly eventRepository: EventMongoRepository,
    private readonly ticketRepository: TicketMongoRepository,
    private readonly unityOfWork: MongoUnityOfWork,
  ) {
    const useCase = UpdateTicketStatusUsecase.build({
      eventRepository,
      ticketRepository,
      unityOfWork
    })

    this.useCase = useCase
  }

  public async execute(input: UpdateTicketStatusInputDto): Promise<UpdateTicketStatusOutputDto> {
    return this.useCase.execute(input)
  }
}