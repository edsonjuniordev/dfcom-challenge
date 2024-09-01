import { TicketStatus } from '@events/application/domain/entities/ticket.entity';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from 'mongoose';

@Schema({ collection: 'tickets' })
export class TicketModel {
  @Prop({ unique: true })
  id: string;

  @Prop()
  userId: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'events',
    required: true
  })
  event: Types.ObjectId;

  @Prop()
  price: number;

  @Prop({
    type: String,
    enum: TicketStatus
  })
  status: TicketStatus;

  @Prop()
  customerEmail: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const TicketSchema = SchemaFactory.createForClass(TicketModel);