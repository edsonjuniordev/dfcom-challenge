import { Module } from "@nestjs/common";
import { KafkaMessaging } from "./kafka.messaging";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { KafkaConsumer } from "./kafka.consumer";
import { ProcessTicketPaymentUsecaseProvider } from "@payments/infra/providers/process-ticket-payment.provider";
import { PaymentGatewayMock } from "@payments/infra/payment-gateway/mock/payment-gateway.mock";

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
  providers: [KafkaMessaging, ProcessTicketPaymentUsecaseProvider, PaymentGatewayMock],
  exports: [KafkaMessaging],
  controllers: [KafkaConsumer]
})
export class KafkaModule { }