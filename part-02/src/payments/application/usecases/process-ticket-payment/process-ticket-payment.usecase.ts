import { PaymentGateway } from "@payments/application/payment-gateway/payment-gateway";
import { Usecase } from "../usecase";
import { ProcessTicketPaymentBuildDto, ProcessTicketPaymentInputDto, ProcessTicketPaymentOutputDto } from "./process-ticket-payment.dto";
import { Payment } from "@payments/application/domain/entities/payment.entity";
import { PaymentRepository } from "@payments/application/repositories/payment.repository";
import { Messaging } from "@payments/application/messaging/messaging";

export class ProcessTicketPaymentUsecase implements Usecase<ProcessTicketPaymentInputDto, ProcessTicketPaymentOutputDto> {
  private constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly paymentRepository: PaymentRepository,
    private readonly messaging: Messaging,
  ) { }

  public static build({
    paymentGateway,
    paymentRepository,
    messaging
  }: ProcessTicketPaymentBuildDto): ProcessTicketPaymentUsecase {
    return new ProcessTicketPaymentUsecase(paymentGateway, paymentRepository, messaging);
  }

  public async execute({
    ticketId,
    price
  }: ProcessTicketPaymentInputDto): Promise<ProcessTicketPaymentOutputDto> {
    const payment = Payment.create({
      ticketId,
      price
    });

    try {
      // The payment gateway logic comes here
      const externalId = await this.paymentGateway.processPayment();

      payment.paid(externalId);

      await this.paymentRepository.create(payment);

      return payment.toDto();
    } catch (error) {
      console.log("🚀 ~ ProcessTicketPaymentUsecase error:", error)
      
      payment.failed();

      await this.paymentRepository.create(payment);

      throw new Error(`Error while processing payment - ${error.message}`);
    } finally {
      await this.messaging.sendPaymentProcessedEvent(payment);
    }
  }
}