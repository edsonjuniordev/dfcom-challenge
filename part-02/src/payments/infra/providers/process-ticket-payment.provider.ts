import { Injectable } from "@nestjs/common"
import { ProcessTicketPaymentUsecase } from "@payments/application/usecases/process-ticket-payment/process-ticket-payment.usecase"
import { PaymentMongoRepository } from "../database/mongo/repositories/payment.repository"
import { PaymentGatewayMock } from "../payment-gateway/mock/payment-gateway.mock"
import { KafkaMessaging } from "../messaging/kafka/kafka.messaging"
import { ProcessTicketPaymentInputDto, ProcessTicketPaymentOutputDto } from "@payments/application/usecases/process-ticket-payment/process-ticket-payment.dto"

@Injectable()
export class ProcessTicketPaymentUsecaseProvider {
  private useCase: ProcessTicketPaymentUsecase

  constructor(
    private readonly paymentRepository: PaymentMongoRepository,
    private readonly paymentGateway: PaymentGatewayMock,
    private readonly messaging: KafkaMessaging
  ) {
    const useCase = ProcessTicketPaymentUsecase.build({
      paymentRepository,
      messaging,
      paymentGateway,
    })

    this.useCase = useCase
  }

  public async execute(input: ProcessTicketPaymentInputDto): Promise<ProcessTicketPaymentOutputDto> {
    return this.useCase.execute(input)
  }
}