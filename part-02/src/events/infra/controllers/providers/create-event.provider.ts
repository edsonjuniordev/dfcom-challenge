import { CreateEventInputDto, CreateEventOutputDto } from "@events/application/usecases/create-event/create-event.dto"
import { CreateEventUsecase } from "@events/application/usecases/create-event/create-event.usecase"
import { EventMongoRepository } from "@events/infra/database/mongo/repositories/event.repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CreateEventUsecaseProvider {
  private useCase: CreateEventUsecase

  constructor(
    private readonly eventRepository: EventMongoRepository,
  ) {
    const useCase = CreateEventUsecase.build({
      eventRepository
    })

    this.useCase = useCase
  }

  public async execute(input: CreateEventInputDto): Promise<CreateEventOutputDto> {
    return this.useCase.execute(input)
  }
}