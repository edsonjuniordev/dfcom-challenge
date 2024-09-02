import { Payment } from "../domain/entities/payment.entity";

export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
}