import { PaymentStatus } from "@payments/application/domain/entities/payment.entity";
import { Messaging } from "@payments/application/messaging/messaging";
import { PaymentGateway } from "@payments/application/payment-gateway/payment-gateway";
import { PaymentRepository } from "@payments/application/repositories/payment.repository";

export type ProcessTicketPaymentBuildDto = {
  paymentGateway: PaymentGateway;
  paymentRepository: PaymentRepository;
  messaging: Messaging;
}

export type ProcessTicketPaymentInputDto = {
  ticketId: string;
  price: number;
};

export type ProcessTicketPaymentOutputDto = {
  id: string;
  ticketId: string;
  externalId: string;
  price: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};