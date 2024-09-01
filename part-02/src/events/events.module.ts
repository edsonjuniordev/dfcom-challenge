import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { EventController } from "./infra/controllers/event.controller";
import { CreateEventUsecaseProvider } from "./infra/controllers/providers/create-event.provider";
import { ListEventsUsecaseProvider } from "./infra/controllers/providers/list-events.provider";
import { TicketController } from "./infra/controllers/ticket.controller";
import { DatabaseModule } from "./infra/database/database.module";
import { CreateTicketUsecaseProvider } from "./infra/controllers/providers/create-ticket.provider";
import { MessagingModule } from "./infra/messaging/messaging.module";

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }
      }),
      inject: [ConfigService]
    }),
    MessagingModule
  ],
  providers: [
    CreateEventUsecaseProvider,
    ListEventsUsecaseProvider,
    CreateTicketUsecaseProvider
  ],
  controllers: [TicketController, EventController]
})
export class EventsModule { }