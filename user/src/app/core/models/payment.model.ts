export interface Payment {
  id: number;
  subscriptionId: number;
  userId: number;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentDTO {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  subscriptionId?: number;
  bookLoadId?: number;
  paymentType: string;
  paymentStatus: string;
  paymentGateway: string;
  amount: number;
  transactionId?: string;
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  gatewaySignature?: string;
  description?: string;
  failureReason?: string;
  initiatedAt?: string;
  createdAt?: string;
  completedAt?: string;
  updatedAt?: string;
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  INITIATED = 'INITIATED',
}

export interface PaymentVerifyRequest {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  subscriptionId?: number;
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  subscriptionId: number;
}

export interface PaymentHistory {
  id: number;
  planName: string;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}
