import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PaymentStatus } from "@payments/application/domain/entities/payment.entity";

@Schema({ collection: 'payments' })
export class PaymentModel {
  @Prop({ unique: true })
  id: string;

  @Prop({ unique: true })
  ticketId: string;

  @Prop({ unique: true })
  externalId: string;

  @Prop()
  price: number;

  @Prop({ type: String, enum: PaymentStatus })
  status: PaymentStatus;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentModel);