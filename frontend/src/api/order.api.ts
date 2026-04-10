import type { TOrderSchema } from '@/schemas/order.schema';
import axios from '@/api/axios.customize';
import type { TCheckout, TOrderResponse, TPaymentMethod, TShippingAddress } from '@/types/order';

export const checkoutAPI = async (rawData: TOrderSchema) => {
  const data: TCheckout = {
    paymentMethod: rawData.paymentMethod as TPaymentMethod,
    shippingAddress: {
      detailAddress: rawData.detailAddress,
      phone: rawData.phone,
      province: rawData.province,
      receiverName: rawData.receiverName,
      ward: rawData.ward,
    } as TShippingAddress,
  };
  const result = await axios.post<ApiResponse<TOrderResponse>>('/orders', data);
  return result.data;
};
