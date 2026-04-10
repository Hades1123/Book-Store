import z from 'zod';

const paymentMethods = ['COD', 'VNPAY'];

export const orderSchema = z.object({
  receiverName: z.string().trim().nonempty({ error: 'Tên người nhận không được để trống' }),
  phone: z.string().trim().length(10, { error: 'Định dạng số điện thoại không hợp lệ' }),
  province: z.string().trim().nonempty('Vui lòng nhập tên tỉnh / thành phố'),
  ward: z.string().trim().nonempty('Vui lòng nhập tên phường / quận'),
  detailAddress: z.string().trim().nonempty('Vui lòng nhập tên thôn, số nhà, đường,...'),
  paymentMethod: z.enum(paymentMethods, { error: 'Vui lòng chọn phương thức thanh toán' }),
  notes: z.string().optional(),
});

export type TOrderSchema = z.infer<typeof orderSchema>;
