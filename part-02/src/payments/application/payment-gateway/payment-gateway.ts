export interface PaymentGateway {
  processPayment(): Promise<string>;
}