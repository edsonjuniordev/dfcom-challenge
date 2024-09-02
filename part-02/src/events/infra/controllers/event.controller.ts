import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateEventUsecaseProvider } from "../providers/create-event.provider";
import { CreateEventInputDto } from "@events/application/usecases/create-event/create-event.dto";
import { CreateEventRequest, CreateEventResponse } from "./dtos/create-event.dto";
import { ListEventsUsecaseProvider } from "../providers/list-events.provider";
import { ListEventsResponse } from "./dtos/list-events.dto";
import { IsPublic } from "./decorators/is.public";
import { AuthGuard } from "./auth.guard";

@Controller('events')
export class EventController {
  constructor(
    private readonly createEvent: CreateEventUsecaseProvider,
    private readonly listEvents: ListEventsUsecaseProvider
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  public async create(
    @Body() createEventRequest: CreateEventRequest
  ): Promise<CreateEventResponse> {
    const createEventInput: CreateEventInputDto = {
      name: createEventRequest.name,
      price: createEventRequest.price,
      totalCapacity: createEventRequest.totalCapacity,
    }

    const output = await this.createEvent.execute(createEventInput);

    return output;
  }

  @IsPublic()
  @Get()
  public async list(): Promise<ListEventsResponse> {
    const output = await this.listEvents.execute();

    return output;
  }
}