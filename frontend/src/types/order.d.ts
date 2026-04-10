export type TPaymentMethod = 'COD' | 'VNPAY';

type TShippingAddress = {
  receiverName: string;
  phone: string;
  province: string;
  ward: string;
  detailAddress: string;
};

type TCheckout = {
  shippingAddress: TShippingAddress;
  paymentMethod: TPaymentMethod;
  note?: string;
};

type TOrderItemResponse = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: bigint;
  quantity: number;
  subtotal: bigint;
};

type TPaymentResponse = {
  id: string;
  method: PaymentMethod;
  status: string;
  amount: bigint;
  paidAt: Date | null;
};

type TOrderResponse = {
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
