import { TicketStatus } from "@events/application/domain/entities/ticket.entity";
import { IsEmail, IsNotEmpty, IsUUID } from "class-validator";

export class CreateTicketRequest {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
  
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;
}

export type CreateTicketResponse = {
  id: string;
  userId: string;
  price: number;
  event: {
    id: string;
    name: string;
    price: number;
    totalCapacity: number;
    availableCapacity: number;
    createdAt: string;
    updatedAt: string;
  };
  status: TicketStatus;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}