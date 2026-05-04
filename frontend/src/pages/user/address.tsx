import { useState, useCallback } from 'react';
import { Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAddress } from '@/hooks/queries/useAddress';
import { useAddressMutation } from '@/hooks/mutations/useAddressMutation';
import { AddressCard } from '@/components/user/AddressCard';
import { AddressFormModal } from '@/components/user/AddressFormModal';
import { useQueryClient } from '@tanstack/react-query';
import { ADDRESS_KEYS } from '@/constants/queryKeys';
import type { TAddress } from '@/types/address';
import type { TAddressSchema } from '@/schemas/address.schema';
import './address.scss';

const MAX_ADDRESSES = 3;

export const AddressPage = () => {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading } = useAddress();
  const { createMutation, updateMutation, deleteMutation, setDefaultMutation } = useAddressMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TAddress | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const invalidateAddresses = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
  }, [queryClient]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address: TAddress) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleFormSubmit = (data: TAddressSchema) => {
    if (editingAddress) {
      updateMutation.mutate(
        { id: editingAddress.id, dto: data },
        { onSuccess: invalidateAddresses }
      );
    } else {
      createMutation.mutate(data, { onSuccess: invalidateAddresses });
    }
    handleCloseForm();
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId, {
        onSuccess: () => {
          invalidateAddresses();
          setDeleteConfirmId(null);
        },
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id, { onSuccess: invalidateAddresses });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isAtLimit = addresses.length >= MAX_ADDRESSES;

  return (
    <div className="address-page">
      <div className="address-page__header">
        <h2 className="address-page__title">My Addresses</h2>
        <Tooltip title={isAtLimit ? 'Maximum 3 addresses allowed' : ''}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              disabled={isAtLimit}
            >
              Add New
            </Button>
          </span>
        </Tooltip>
      </div>

      {isLoading ? (
        <div className="address-page__empty">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="address-page__empty">
          <div className="address-page__empty-icon">📍</div>
          <div className="address-page__empty-text">No addresses yet</div>
          <div className="address-page__empty-subtext">Add your first address to get started</div>
        </div>
      ) : (
        <div className="address-page__grid">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteRequest}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialData={editingAddress}
        isEditMode={!!editingAddress}
      />

      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this address? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
