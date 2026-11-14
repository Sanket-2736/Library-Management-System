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

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  subscriptionId: number;
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
