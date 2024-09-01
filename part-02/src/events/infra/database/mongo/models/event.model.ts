import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: 'events' })
export class EventModel {
  @Prop({ unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  totalCapacity: number;

  @Prop()
  availableCapacity: number;

  @Prop({ default: false, required: false })
  locked?: boolean;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);