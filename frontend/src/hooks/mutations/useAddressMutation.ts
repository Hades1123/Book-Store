import { isAxiosError } from '@/api/axios.customize';
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type CreateAddressDto,
  type UpdateAddressDto,
} from '@/api/address.api';
import { toast } from '@/stores/toast.store';
import { useMutation } from '@tanstack/react-query';

export const useAddressMutation = () => {
  const createMutation = useMutation({
    mutationFn: async (dto: CreateAddressDto) => {
      const result = await createAddress(dto);
      return result.data;
    },
    onSuccess: () => {
      toast.success('Address added successfully');
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      } else {
        toast.error('Failed to add address');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateAddressDto }) => {
      const result = await updateAddress(id, dto);
      return result.data;
    },
    onSuccess: () => {
      toast.success('Address updated successfully');
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      } else {
        toast.error('Failed to update address');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAddress(id);
    },
    onSuccess: () => {
      toast.success('Address deleted successfully');
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      } else {
        toast.error('Failed to delete address');
      }
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await setDefaultAddress(id);
      return result.data;
    },
    onSuccess: () => {
      toast.success('Default address updated');
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      } else {
        toast.error('Failed to set default address');
      }
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    setDefaultMutation,
  };
};
