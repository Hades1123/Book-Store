import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthStore } from '@/stores/auth.store';

export const AuthLoadingBackdrop = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  console.log(isLoading);
  return (
    <Backdrop
      sx={(theme) => ({ color: 'blue', zIndex: theme.zIndex.drawer + 1 })}
      open={isLoading}
      onClick={() => {}}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};
