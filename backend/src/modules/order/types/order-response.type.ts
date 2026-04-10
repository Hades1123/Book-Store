import { PaymentMethod } from '../dto/checkout.dto';

export type TOrderItemResponse = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: bigint;
  quantity: number;
  subtotal: bigint;
};

export type TPaymentResponse = {
  id: string;
  method: PaymentMethod;
  status: string;
  amount: bigint;
  paidAt: Date | null;
};

export type TOrderResponse = {
  id: string;
  status: string;
  receiverName: string;
  receiverPhone: string;
  shippingProvince: string;
  shippingWard: string;
  shippingDetail: string;
  totalAmount: bigint;
  shippingFee: bigint;
  finalAmount: bigint;
  note: string | null;
  items: TOrderItemResponse[];
  payment: TPaymentResponse;
  createdAt: Date;
  updatedAt: Date;
};