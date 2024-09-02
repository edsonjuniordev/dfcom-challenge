import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "@payments/application/domain/entities/payment.entity";
import { PaymentRepository } from "@payments/application/repositories/payment.repository";
import { Model } from "mongoose";
import { PaymentModel } from "../models/event.model";
import { PaymentEntityToModelMapper } from "./mappers/payment-entity-to-model.mapper";

export class PaymentMongoRepository implements PaymentRepository {
  constructor(
    @InjectModel(PaymentModel.name) private readonly paymentModel: Model<PaymentModel>,
  ) { }

  public async create(payment: Payment): Promise<void> {

    const aModel = PaymentEntityToModelMapper.map(payment);

    await this.paymentModel.create(aModel);
  }
}