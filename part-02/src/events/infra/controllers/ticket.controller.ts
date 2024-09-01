import { Body, Controller, InternalServerErrorException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { CreateTicketUsecaseProvider } from "./providers/create-ticket.provider";
import { CreateTicketRequest, CreateTicketResponse } from "./dtos/create-ticket.dto";
import { CreateTicketInputDto } from "@events/application/usecases/create-ticket/create-ticket.dto";
import { ActiveUserId } from "./decorators/is.active.user.id";

@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly createTicket: CreateTicketUsecaseProvider
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  public async create(
    @Body() createTicketRequest: CreateTicketRequest,
    @ActiveUserId() userId: string
  ): Promise<CreateTicketResponse> {
    try {
      const createTicketInput: CreateTicketInputDto = {
        userId,
        eventId: createTicketRequest.eventId,
        customerEmail: createTicketRequest.customerEmail,
      };
  
      const output = await this.createTicket.execute(createTicketInput);
  
      return output;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}