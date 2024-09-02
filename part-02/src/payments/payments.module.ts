import { Module } from "@nestjs/common";
import { MessagingModule } from "./infra/messaging/messaging.module";

@Module({
  imports: [MessagingModule],
})
export class PaymentsModule {}