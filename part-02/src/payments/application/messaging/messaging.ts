import { Payment } from "../domain/entities/payment.entity";

export interface Messaging {
  sendPaymentProcessedEvent(payment: Payment): Promise<void>;
}