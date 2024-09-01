import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEventRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  totalCapacity: number;
}

export type CreateEventResponse = {
  id: string;
  name: string;
  price: number;
  totalCapacity: number;
  availableCapacity: number;
  createdAt: string;
  updatedAt: string;
}