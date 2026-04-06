import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';

const DURATION = 5000;

export type TStatus = {
  open?: boolean;
  success: boolean;
  message: string;
  duration?: number;
  displayCooldown?: boolean;
};

export interface IResendAlertComponent {
  handleClose: () => void;
  status: TStatus;
}

export const AlertComponent = (prop: IResendAlertComponent) => {
  const { handleClose, status } = prop;
  const { displayCooldown = false, duration } = status;
  const [cooldown, setCooldown] = useState(duration ? duration / 1000 : DURATION / 1000);

  useEffect(() => {
    if (!displayCooldown || cooldown == 0) {
      return;
    }
    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [cooldown]);

  useEffect(() => {
    if (status.open) {
      setCooldown(duration ? duration / 1000 : DURATION / 1000);
    }
  }, [status.open, duration]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={status.open ?? true}
        autoHideDuration={duration ?? DURATION}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={status.success ? 'success' : 'warning'}
          variant="filled"
          sx={{ width: '100%', fontSize: '20px' }}
        >
          {status.message ?? 'Success'}
          {displayCooldown ? `(${cooldown})` : ''}
        </Alert>
      </Snackbar>
    </div>
  );
};
