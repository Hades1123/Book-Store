import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '@/api/upload.api';
import { updateUserProfile } from '@/api/user.api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/toast.store';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only PNG, JPG, and JPEG images are allowed');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size must be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleSave = async () => {
    setIsUploading(true);
    try {
      let newAvatarPublicId: string | undefined;

      if (selectedFile) {
        const uploadResult = await uploadFile(selectedFile, 'avatar');
        if (uploadResult.data) {
          newAvatarPublicId = uploadResult.data.public_id;
        }
      }

      const result = await updateUserProfile({
        fullName,
        phone,
        avatarPublicId: newAvatarPublicId,
      });

      if (result.data) {
        setUser(result.data);
      }

      toast.success('Profile updated successfully');
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? 'Failed to update profile. Please try again'
          : 'An unexpected error occurred';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Avatar
          </Typography>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: isDragOver ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragOver ? 'action.hover' : 'transparent',
              transition: 'all 0.2s',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
            {previewUrl ? (
              <Box>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  {selectedFile?.name}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 1 }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Drag & drop or click to change
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress size={20} /> : null}
        >
          {isUploading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
