import { PaymentRepository } from "@payments/application/repositories/payment.repository";
import { ProcessTicketPaymentBuildDto, ProcessTicketPaymentInputDto, ProcessTicketPaymentOutputDto } from "./process-ticket-payment.dto";
import { PaymentGateway } from "@payments/application/payment-gateway/payment-gateway";
import { Messaging } from "@payments/application/messaging/messaging";
import { DateGenerator } from "@shared/utils/date-generator";
import { UUIDGenerator } from "@shared/utils/uuid-generator";
import { PaymentStatus } from "@payments/application/domain/entities/payment.entity";
import { ProcessTicketPaymentUsecase } from "./process-ticket-payment.usecase";

describe("process-ticket-payment usecase", () => {
  let buildMock: ProcessTicketPaymentBuildDto;
  let inputMock: ProcessTicketPaymentInputDto;
  let outputMock: ProcessTicketPaymentOutputDto;

  let paymentRepositoryMock: PaymentRepository;

  let paymentGatewayMock: PaymentGateway;

  let messagingMock: Messaging;

  beforeEach(() => {
    paymentRepositoryMock = {
      create: jest.fn().mockResolvedValue(null),
    };

    paymentGatewayMock = {
      processPayment: jest.fn().mockResolvedValue("bb5957cd-9c02-41b8-bc18-723d3eff9283"),
    };

    messagingMock = {
      sendPaymentProcessedEvent: jest.fn().mockResolvedValue(null)
    }

    buildMock = {
      paymentRepository: paymentRepositoryMock,
      paymentGateway: paymentGatewayMock,
      messaging: messagingMock
    };

    inputMock = {
      ticketId: UUIDGenerator.generate(),
      price: 1000,
    };

    const now = DateGenerator.now();

    outputMock = {
      id: UUIDGenerator.generate(),
      ticketId: inputMock.ticketId,
      externalId: "bb5957cd-9c02-41b8-bc18-723d3eff9283",
      price: 1000,
      status: PaymentStatus.PAID,
      createdAt: now,
      updatedAt: now,
    }
  })

  describe("build", () => {
    it("should return an instance of ProcessTicketPaymentUsecase", () => {
      const processTicketPaymentUsecase = ProcessTicketPaymentUsecase.build(buildMock);

      expect(processTicketPaymentUsecase).toBeDefined();
      expect(processTicketPaymentUsecase).toBeInstanceOf(ProcessTicketPaymentUsecase);
    })
  })

  describe("execute", () => {
    it("should return a ProcessTicketPaymentOutputDto when passing a valid ProcessTicketPaymentInputDto", async () => {
      const processTicketPaymentUsecase = ProcessTicketPaymentUsecase.build(buildMock);

      const output = await processTicketPaymentUsecase.execute(inputMock)

      output.id = outputMock.id;
      output.createdAt = outputMock.createdAt;
      output.updatedAt = outputMock.updatedAt;

      expect(output).toBeDefined()
      expect(output).toEqual(outputMock)
      expect(paymentRepositoryMock.create).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception", async () => {
      jest.spyOn(paymentGatewayMock, "processPayment").mockRejectedValueOnce(new Error());

      const processTicketPaymentUsecase = ProcessTicketPaymentUsecase.build(buildMock);

      expect(processTicketPaymentUsecase.execute(inputMock)).rejects.toThrow();
    })
  })
})