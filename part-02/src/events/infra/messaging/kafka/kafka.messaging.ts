import { Ticket } from "@events/application/domain/entities/ticket.entity";
import { Messaging } from "@events/application/messaging/messaging";
import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Producer } from "kafkajs";

@Injectable()
export class KafkaMessaging implements Messaging {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_MESSAGING') private readonly kafka: ClientKafka,
  ) { }

  public async onModuleInit() {
    this.kafkaProducer = await this.kafka.connect();
  }

  public async sendTicketCreatedEvent(ticket: Ticket): Promise<void> {
    const topic = 'ticket.created';

    const payload = JSON.stringify(ticket.toDto());

    this.kafkaProducer.send({
      topic,
      messages: [{
        key: topic,
        value: payload
      }]
    });
  }
}