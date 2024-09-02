import { UUIDGenerator } from "@shared/utils/uuid-generator";
import { Event, EventProps, EventWithDto } from "./event.entity";
import { DateGenerator } from "@shared/utils/date-generator";

export enum TicketStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export type TicketProps = {
  id: string;
  userId: string;
  event: Event;
  price: number;
  status: TicketStatus;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketDto = {
  id: string;
  userId: string;
  event: EventProps;
  price: number;
  status: TicketStatus;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketCreateDto = {
  userId: string;
  event: Event;
  price: number;
  customerEmail: string;
}

export type TicketWithDto = {
  id: string;
  userId: string;
  event: EventWithDto;
  price: number;
  status: TicketStatus;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export class Ticket {
  private constructor(private props: TicketProps) {}

  public static create({
    userId,
    event,
    price,
    customerEmail
  }: TicketCreateDto): Ticket {
    const id = UUIDGenerator.generate();

    const now = DateGenerator.now();

    const ticket = new Ticket({
      id,
      userId,
      event,
      price,
      status: TicketStatus.CREATED,
      customerEmail,
      createdAt: now,
      updatedAt: now,
    });

    return ticket;
  }

  public static with({
    id,
    userId,
    event,
    price,
    status,
    customerEmail,
    createdAt,
    updatedAt,
  }: TicketWithDto): Ticket {
    const ticketEvent = Event.with(event);

    const ticket = new Ticket({
      id,
      userId,
      event: ticketEvent,
      price,
      status,
      customerEmail,
      createdAt,
      updatedAt,
    });

    return ticket;
  }

  public toDto(): TicketDto {
    return {
      id: this.props.id,
      userId: this.props.userId,
      event: this.props.event.toDto(),
      price: this.props.price,
      status: this.props.status,
      customerEmail: this.props.customerEmail,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }

  public paid(): void {
    this.props.status = TicketStatus.PAID;
  }

  public failed(): void {
    this.props.status = TicketStatus.FAILED;
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get event(): Event {
    return this.props.event;
  }
  
  public get price(): number {
    return this.props.price;
  }
  
  public get status(): TicketStatus {
    return this.props.status;
  }
  
  public get customerEmail(): string {
    return this.props.customerEmail;
  }
  
  public get createdAt(): string {
    return this.props.createdAt;
  }
  
  public get updatedAt(): string {
    return this.props.updatedAt;
  }
  
}