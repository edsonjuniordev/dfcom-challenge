import { Injectable } from "@nestjs/common";
import { PaymentGateway } from "@payments/application/payment-gateway/payment-gateway";
import { UUIDGenerator } from "@shared/utils/uuid-generator";

@Injectable()
export class PaymentGatewayMock implements PaymentGateway {
  public async processPayment(): Promise<string> {
    return UUIDGenerator.generate();
  }
}