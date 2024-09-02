import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { EventController } from "./infra/controllers/event.controller";
import { TicketController } from "./infra/controllers/ticket.controller";
import { MessagingModule } from "./infra/messaging/messaging.module";
import { CreateEventUsecaseProvider } from "./infra/providers/create-event.provider";
import { CreateTicketUsecaseProvider } from "./infra/providers/create-ticket.provider";
import { ListEventsUsecaseProvider } from "./infra/providers/list-events.provider";
import { UpdateTicketStatusUsecaseProvider } from "./infra/providers/update-ticket-status.provider";

@Module({
  imports: [
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
    CreateTicketUsecaseProvider,
    UpdateTicketStatusUsecaseProvider,
  ],
  controllers: [TicketController, EventController]
})
export class EventsModule { }