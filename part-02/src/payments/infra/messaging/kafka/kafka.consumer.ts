import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "@nestjs/microservices/external/kafka.interface";
import { ProcessTicketPaymentUsecaseProvider } from "@payments/infra/providers/process-ticket-payment.provider";

@Controller()
export class KafkaConsumer {
  constructor(
    private readonly processTicketPayment: ProcessTicketPaymentUsecaseProvider
  ) { }

  @MessagePattern('ticket.created')
  public async consumeCreateTicket(@Payload() message: KafkaMessage): Promise<void> {
    const { id } = message as any

    const payload = {
      ...message as any,
      ticketId: id
    };

    await this.processTicketPayment.execute(payload);
  }
}