import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaMessaging } from "./kafka.messaging";
import { ConfigService } from "@nestjs/config";
import { KafkaConsumer } from "./kafka.consumer";
import { UpdateTicketStatusUsecaseProvider } from "@events/infra/providers/update-ticket-status.provider";

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (configService: ConfigService) => ({
            options: {
              client: {
                brokers: [configService.get('KAFKA_BROKER')]
              },
              consumer: {
                groupId: 'group1',
                allowAutoTopicCreation: true,
              }
            },
            transport: Transport.KAFKA
          }),
          name: "KAFKA_MESSAGING",
          inject: [ConfigService]
        }
      ]
    })
  ],
  controllers: [KafkaConsumer],
  providers: [KafkaMessaging, UpdateTicketStatusUsecaseProvider],
  exports: [KafkaMessaging, UpdateTicketStatusUsecaseProvider]
})
export class KafkaModule { }