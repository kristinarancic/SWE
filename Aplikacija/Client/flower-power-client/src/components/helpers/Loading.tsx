import { Stack, CircularProgress } from '@mui/material';
const Loading = () => {
  return (
    <Stack
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress color='secondary' />
    </Stack>
  );
};

export default Loading;
