import { Payment } from "@payments/application/domain/entities/payment.entity";
import { PaymentModel } from "../../models/event.model";

export class PaymentEntityToModelMapper {
  public static map(payment: Payment): PaymentModel {
    const aModel: PaymentModel = {
      id: payment.id,
      ticketId: payment.ticketId,
      externalId: payment.externalId,
      price: payment.price,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };

    return aModel;
  }
}