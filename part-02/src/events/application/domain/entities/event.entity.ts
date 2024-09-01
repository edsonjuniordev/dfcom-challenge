import { DateGenerator } from "@events/utils/date-generator";
import { UUIDGenerator } from "@events/utils/uuid-generator";

export type EventProps = {
  id: string;
  name: string;
  price: number;
  totalCapacity: number;
  availableCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export type EventCreateDto = {
  name: string;
  price: number;
  totalCapacity: number;
}

export type EventWithDto = {
  id: string;
  name: string;
  price: number;
  totalCapacity: number;
  availableCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export class Event {
  private constructor(private props: EventProps) { }

  public static create({
    name,
    price,
    totalCapacity
  }: EventCreateDto): Event {
    const id = UUIDGenerator.generate();

    const now = DateGenerator.now();

    const event = new Event({
      id,
      name,
      price,
      totalCapacity,
      availableCapacity: totalCapacity,
      createdAt: now,
      updatedAt: now
    });

    return event;
  }

  public static with({
    id,
    name,
    price,
    totalCapacity,
    availableCapacity,
    createdAt,
    updatedAt
  }: EventWithDto): Event {
    const event = new Event({
      id,
      name,
      price,
      totalCapacity,
      availableCapacity,
      createdAt,
      updatedAt
    });

    return event;
  }

  public toDto(): EventProps {
    return {
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
      totalCapacity: this.props.totalCapacity,
      availableCapacity: this.props.availableCapacity,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }

  public isFull(): boolean {
    if (this.props.availableCapacity === 0) {
      return true;
    }

    return false;
  }

  public ticketReservation(): void {
    this.props.availableCapacity -= 1;
  }

  public releaseTicketReservation(): void {
    this.props.availableCapacity += 1;
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get price(): number {
    return this.props.price;
  }

  public get totalCapacity(): number {
    return this.props.totalCapacity;
  }

  public get availableCapacity(): number {
    return this.props.availableCapacity;
  }

  public get createdAt(): string {
    return this.props.createdAt;
  }

  public get updatedAt(): string {
    return this.props.updatedAt;
  }
}