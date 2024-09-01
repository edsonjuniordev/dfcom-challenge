import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaMessaging } from "./kafka.messaging";
import { ConfigService } from "@nestjs/config";

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
  providers: [KafkaMessaging],
  exports: [KafkaMessaging]
})
export class KafkaModule { }