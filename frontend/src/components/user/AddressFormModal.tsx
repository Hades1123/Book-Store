import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { addressSchema, type TAddressSchema } from '@/schemas/address.schema';
import type { TAddress } from '@/types/address';

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TAddressSchema) => void;
  isSubmitting: boolean;
  initialData?: TAddress | null;
  isEditMode: boolean;
}

const emptyForm = {
  receiverName: '',
  phone: '',
  province: '',
  ward: '',
  detailAddress: '',
};

export const AddressFormModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  isEditMode,
}: AddressFormModalProps) => {
  const [form, setForm] = useState<TAddressSchema>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof TAddressSchema, string>>>({});

  useEffect(() => {
    if (open) {
      if (initialData && isEditMode) {
        setForm({
          receiverName: initialData.receiverName,
          phone: initialData.phone,
          province: initialData.province,
          ward: initialData.ward,
          detailAddress: initialData.detailAddress,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, initialData, isEditMode]);

  const handleChange = useCallback(
    (field: keyof TAddressSchema) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = () => {
    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TAddressSchema, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof TAddressSchema;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSubmit(result.data);
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Address' : 'Add New Address'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Receiver Name"
            value={form.receiverName}
            onChange={handleChange('receiverName')}
            error={!!errors.receiverName}
            helperText={errors.receiverName}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={form.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            fullWidth
            label="Province / City"
            value={form.province}
            onChange={handleChange('province')}
            error={!!errors.province}
            helperText={errors.province}
          />
          <TextField
            fullWidth
            label="Ward / District"
            value={form.ward}
            onChange={handleChange('ward')}
            error={!!errors.ward}
            helperText={errors.ward}
          />
          <TextField
            fullWidth
            label="Detail Address"
            value={form.detailAddress}
            onChange={handleChange('detailAddress')}
            error={!!errors.detailAddress}
            helperText={errors.detailAddress}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
