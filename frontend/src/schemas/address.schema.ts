import z from 'zod';

export const addressSchema = z.object({
  receiverName: z.string().trim().nonempty({ error: 'Tên người nhận không được để trống' }),
  phone: z.string().trim().length(10, { error: 'Định dạng số điện thoại không hợp lệ' }),
  province: z.string().trim().nonempty('Vui lòng nhập tên tỉnh / thành phố'),
  ward: z.string().trim().nonempty('Vui lòng nhập tên phường / quận'),
  detailAddress: z.string().trim().nonempty('Vui lòng nhập tên thôn, số nhà, đường,...'),
});

export type TAddressSchema = z.infer<typeof addressSchema>;
