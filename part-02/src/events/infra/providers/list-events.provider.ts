import { ListEventsOutputDto } from "@events/application/usecases/list-events/list-events.dto"
import { ListEventsUsecase } from "@events/application/usecases/list-events/list-events.usecase"
import { EventMongoRepository } from "@events/infra/database/mongo/repositories/event.repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ListEventsUsecaseProvider {
  private useCase: ListEventsUsecase

  constructor(
    private readonly eventRepository: EventMongoRepository,
  ) {
    const useCase = ListEventsUsecase.build({
      eventRepository
    })

    this.useCase = useCase
  }

  public async execute(): Promise<ListEventsOutputDto> {
    return this.useCase.execute()
  }
}