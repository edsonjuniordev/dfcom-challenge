import { UpdateTicketStatusUsecaseProvider } from "@events/infra/providers/update-ticket-status.provider";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "@nestjs/microservices/external/kafka.interface";

@Controller()
export class KafkaConsumer {
  constructor(
    private readonly updateTicketStatus: UpdateTicketStatusUsecaseProvider
  ) { }

  @MessagePattern('payment.processed')
  public async consumeCreateTicket(@Payload() message: KafkaMessage): Promise<void> {
    const payload = {
      ...message as any,
    };

    await this.updateTicketStatus.execute(payload);
  }
}