import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useToastStore } from '@/stores/toast.store';
import type { SlideProps } from '@mui/material/Slide';
import Slide from '@mui/material/Slide';

function SlideTransitions(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const ToastContainer = () => {
  const toast = useToastStore((state) => state.toast);
  const removeToast = useToastStore((state) => state.removeToast);

  return toast.map((item, index) => (
    <Snackbar
      key={item.id}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={true}
      slots={{
        transition: SlideTransitions,
      }}
      sx={{
        bottom: { xs: 90, sm: 16 + index * 60 },
      }}
    >
      <Alert
        onClose={() => removeToast(item.id)}
        severity={item.type}
        variant="filled"
        sx={{ width: '100%', fontSize: '20px', display: 'flex', alignItems: 'center' }}
      >
        {item.message}
      </Alert>
    </Snackbar>
  ));
};
