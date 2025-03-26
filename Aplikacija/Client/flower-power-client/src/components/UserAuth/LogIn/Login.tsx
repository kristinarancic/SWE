import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Grid,
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Input from '../Input';
import Copyright from '../Copyright';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../../../services/Auth/authSlice';
import { useLoginMutation } from '../../../services/Auth/authApiSlice';
import './Login.css';
import { handleChange, handleShowPassword } from '../../helpers/utils';
import {
  selectCurrentLoginDialog,
  selectCurrentEntityTypeDialog,
} from '../../../services/Dialog/dialogSlice';
import {
  toggleRegisterDialog,
  toggleLoginDialog,
} from '../../../services/Dialog/dialogSlice';
import { ICredentials } from '../../helpers/Interfaces';
import { setFeedback } from '../../../services/Feedback/feedbackSlice';

const Login = () => {
  const theme = useTheme();
  // Show password button logic
  const [showPassword, setShowPassword] = useState(false);
  // Login credentials logic
  const [user, setUser] = useState<ICredentials>({ email: '', password: '' });
  const [login, { isLoading, isError, error }] = useLoginMutation();
  // Error message handling - not implemented
  const [errMsg, setErrMsg] = useState('');

  // Dialog Functionality
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(selectCurrentLoginDialog);
  const entityType = useSelector(selectCurrentEntityTypeDialog);

  const handleRegisterOpen = () => {
    dispatch(toggleRegisterDialog(entityType));
  };
  const handleLoginOpen = () => {
    dispatch(toggleLoginDialog(undefined));
  };

  //  Clears error message from backend when user starts typing
  useEffect(() => {
    setErrMsg('');
  }, [user.email, user.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setUser, user);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Ovde promeni za cvecaru
      let res;
      entityType === 'User' || entityType === 'Shop'
        ? (res = await login({ credentials: user, entityType }).unwrap())
        : null;
      const { accessToken } = res;
      // Putting token into state
      dispatch(logIn({ accessToken }));
      // Reseting user
      setUser({ email: '', password: '' });
      // Close Login Dialog
      handleLoginOpen();
      // Navigate to where you were
      navigate(0);
    } catch (error: any) {
      if (!error.status) {
        setErrMsg('No Server Response!');
      } else if (error.status === 400) setErrMsg('Missing Email or Password!');
      else if (error.status === 401) setErrMsg('Unauthorized!');
      else setErrMsg(error.data?.message);
      dispatch(
        setFeedback({
          open: true,
          message: "Nevalidni podaci!",
          time: 3000,
          severity: "error",
        })
      );
    }
  };

  return isLoading ? (
    <Stack sx={{ width: '100vw', ml: '50%', mt: '50%' }}>
      <CircularProgress color='secondary' />
    </Stack>
  ) : (
    <Dialog open={isLoginOpen} onClose={handleLoginOpen}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              margin: theme.spacing(2),
              backgroundColor: '#ab47bc',
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Prijava {entityType === 'User' ? 'Korisnika' : 'Prodavnice'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component='form' noValidate mt={3} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Input
              name='email'
              label='Email Adresa'
              type='email'
              handleChange={handleInputChange}
            />
            <Input
              name='password'
              label='Šifra'
              type={showPassword ? 'text' : 'password'}
              handleChange={handleInputChange}
              handleShowPassword={() => {
                handleShowPassword(setShowPassword);
              }}
            />
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            }}
            className='prijaviSe-button'
          >
            Prijavi se
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button
                sx={{
                  fontSize: 12,
                  marginTop: theme.spacing(-1),
                }}
                onClick={handleRegisterOpen}
                className='registracija-button'
              >
                Nemaš Nalog? Registruj se ovde!
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Copyright mb={3} />
    </Dialog>
  );
};

export default Login;
