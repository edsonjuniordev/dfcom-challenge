import { CreateTicketInputDto, CreateTicketOutputDto } from "@events/application/usecases/create-ticket/create-ticket.dto"
import { CreateTicketUsecase } from "@events/application/usecases/create-ticket/create-ticket.usecase"
import { EventMongoRepository } from "@events/infra/database/mongo/repositories/event.repository"
import { TicketMongoRepository } from "@events/infra/database/mongo/repositories/ticket.repository"
import { KafkaMessaging } from "@events/infra/messaging/kafka/kafka.messaging"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CreateTicketUsecaseProvider {
  private useCase: CreateTicketUsecase

  constructor(
    private readonly eventRepository: EventMongoRepository,
    private readonly ticketRepository: TicketMongoRepository,
    private readonly messaging: KafkaMessaging
  ) {
    const useCase = CreateTicketUsecase.build({
      eventRepository,
      ticketRepository,
      messaging,
    })

    this.useCase = useCase
  }

  public async execute(input: CreateTicketInputDto): Promise<CreateTicketOutputDto> {
    return this.useCase.execute(input)
  }
}