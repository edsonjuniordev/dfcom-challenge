import { EventModel, EventSchema } from "@events/infra/database/mongo/models/event.model";
import { TicketModel, TicketSchema } from "@events/infra/database/mongo/models/ticket.model";
import { EventMongoRepository } from "@events/infra/database/mongo/repositories/event.repository";
import { TicketMongoRepository } from "@events/infra/database/mongo/repositories/ticket.repository";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentModel, PaymentSchema } from "@payments/infra/database/mongo/models/event.model";
import { PaymentMongoRepository } from "@payments/infra/database/mongo/repositories/payment.repository";
import { MongoUnityOfWork } from "./unity-of-work/unity-of-work.mongo";

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_DATABASE_URL'),
      }),
    }),
    MongooseModule.forFeature([
      { name: EventModel.name, schema: EventSchema },
      { name: TicketModel.name, schema: TicketSchema },
      { name: PaymentModel.name, schema: PaymentSchema }
    ]),
  ],
  providers: [EventMongoRepository, TicketMongoRepository, PaymentMongoRepository, MongoUnityOfWork],
  exports: [MongooseModule, EventMongoRepository, TicketMongoRepository, PaymentMongoRepository, MongoUnityOfWork],
})
export class MongoModule { }