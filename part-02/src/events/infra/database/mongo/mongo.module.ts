import { Global, Module } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { EventModel, EventSchema } from "./models/event.model";
import { TicketModel, TicketSchema } from "./models/ticket.model";
import { EventMongoRepository } from "./repositories/event.repository";
import { TicketMongoRepository } from "./repositories/ticket.repository";

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('EVENTS_MONGO_DATABASE_URL'),
      }),
    }),
    MongooseModule.forFeature([
      { name: EventModel.name, schema: EventSchema },
      { name: TicketModel.name, schema: TicketSchema }
    ]),
  ],
  providers: [EventMongoRepository, TicketMongoRepository],
  exports: [MongooseModule, EventMongoRepository, TicketMongoRepository],
})
export class MongoModule { }