import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Producer } from "@nestjs/microservices/external/kafka.interface";
import { Payment } from "@payments/application/domain/entities/payment.entity";
import { Messaging } from "@payments/application/messaging/messaging";

@Injectable()
export class KafkaMessaging implements Messaging {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_MESSAGING') private readonly kafka: ClientKafka,
  ) { }

  public async onModuleInit() {
    this.kafkaProducer = await this.kafka.connect();
  }

  public async sendPaymentProcessedEvent(payment: Payment): Promise<void> {
    const topic = 'payment.processed';

    const payload = JSON.stringify(payment.toDto());

    this.kafkaProducer.send({
      topic,
      messages: [{
        key: topic,
        value: payload
      }]
    });
  }
}