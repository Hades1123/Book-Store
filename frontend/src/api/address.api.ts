import axios from './axios.customize';
import type { TAddress } from '@/types/address';

export interface CreateAddressDto {
  receiverName: string;
  phone: string;
  province: string;
  ward: string;
  detailAddress: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  receiverName?: string;
  phone?: string;
  province?: string;
  ward?: string;
  detailAddress?: string;
  isDefault?: boolean;
}

export const getAddresses = async () => {
  const result = await axios.get<ApiResponse<TAddress[]>>('/addresses');
  return result.data;
};

export const createAddress = async (dto: CreateAddressDto) => {
  const result = await axios.post<ApiResponse<TAddress>>('/addresses', dto);
  return result.data;
};

export const updateAddress = async (id: string, dto: UpdateAddressDto) => {
  const result = await axios.patch<ApiResponse<TAddress>>(`/addresses/${id}`, dto);
  return result.data;
};

export const setDefaultAddress = async (id: string) => {
  const result = await axios.patch<ApiResponse<TAddress>>(`/addresses/${id}/default`);
  return result.data;
};

export const deleteAddress = async (id: string) => {
  const result = await axios.delete<ApiResponse<void>>(`/addresses/${id}`);
  return result.data;
};
