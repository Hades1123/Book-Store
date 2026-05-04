import { Card, CardContent, CardActions, Typography, Button, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { TAddress } from '@/types/address';

interface AddressCardProps {
  address: TAddress;
  onEdit: (address: TAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => {
  return (
    <Card
      sx={{
        position: 'relative',
        border: address.isDefault ? '2px solid' : '1px solid',
        borderColor: address.isDefault ? 'primary.main' : 'divider',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      {address.isDefault && (
        <Chip
          icon={<StarIcon sx={{ fontSize: 16 }} />}
          label="Default"
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
          }}
        />
      )}
      <CardContent sx={{ pt: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {address.receiverName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {address.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {address.province}, {address.ward}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address.detailAddress}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          size="small"
          startIcon={<EditIcon sx={{ fontSize: 18 }} />}
          onClick={() => onEdit(address)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
          onClick={() => onDelete(address.id)}
        >
          Delete
        </Button>
        {!address.isDefault && (
          <Button
            size="small"
            startIcon={<StarBorderIcon sx={{ fontSize: 18 }} />}
            onClick={() => onSetDefault(address.id)}
            sx={{ ml: 'auto' }}
          >
            Set Default
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
