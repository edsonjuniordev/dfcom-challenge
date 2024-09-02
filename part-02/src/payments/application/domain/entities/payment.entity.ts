import { DateGenerator } from "@shared/utils/date-generator";
import { UUIDGenerator } from "@shared/utils/uuid-generator";

export enum PaymentStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export type PaymentProps = {
  id: string;
  ticketId: string;
  externalId: string;
  price: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentCreateDto = {
  ticketId: string;
  price: number;
}

export type PaymentWithDto = {
  id: string;
  ticketId: string;
  externalId: string;
  price: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export class Payment {
  private constructor(private props: PaymentProps) { }

  public static create({
    ticketId,
    price
  }: PaymentCreateDto): Payment {
    const id = UUIDGenerator.generate();

    const now = DateGenerator.now();

    const payment = new Payment({
      id,
      ticketId,
      externalId: '',
      price,
      status: PaymentStatus.CREATED,
      createdAt: now,
      updatedAt: now,
    });

    return payment;
  }

  public static with({
    id,
    ticketId,
    externalId,
    price,
    status,
    createdAt,
    updatedAt,
  }: PaymentWithDto): Payment {
    const payment = new Payment({
      id,
      ticketId,
      externalId,
      price,
      status,
      createdAt,
      updatedAt,
    });

    return payment;
  }

  public toDto(): PaymentProps {
    return {
      id: this.props.id,
      ticketId: this.props.ticketId,
      externalId: this.props.externalId,
      price: this.props.price,
      status: this.props.status,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }

  public paid(externalId: string): void {
    this.props.externalId = externalId;
    this.props.status = PaymentStatus.PAID;
  }

  public failed(): void {
    this.props.status = PaymentStatus.FAILED;
  }

  public get id(): string {
    return this.props.id;
  }
  
  public get ticketId(): string {
    return this.props.ticketId;
  }
  
  public get externalId(): string {
    return this.props.externalId;
  }
  
  public get price(): number {
    return this.props.price;
  }
  
  public get status(): PaymentStatus {
    return this.props.status;
  }
  
  public get createdAt(): string {
    return this.props.createdAt;
  }
  
  public get updatedAt(): string {
    return this.props.updatedAt;
  }
}