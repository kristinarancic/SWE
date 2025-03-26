import { Dispatch, Fragment, SetStateAction, useState, useEffect } from 'react';
import {
  CssBaseline,
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Grid,
} from '@mui/material';
import './Registracija.css';

import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentRegisterDialog } from '../../../services/Dialog/dialogSlice';
import { selectCurrentEntityTypeDialog } from '../../../services/Dialog/dialogSlice';
import {
  toggleLoginDialog,
  toggleRegisterDialog,
} from '../../../services/Dialog/dialogSlice';
import { useRegisterMutation } from '../../../services/Auth/authApiSlice';

import Copyright from '../Copyright';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IRegisterUser, IShop } from '../../helpers/Interfaces';

import Credentials from './Credentials';
import ProfileInfo from './ProfileInfo';
import CompanyInfo from './CompanyInfo';
import WorkingHours from './WorkingHours';
import { setFeedback } from '../../../services/Feedback/feedbackSlice';
import Loading from '../../helpers/Loading';

const Register = () => {
  // Register Dialog Logic
  const dispatch = useDispatch();
  const isRegisterOpen = useSelector(selectCurrentRegisterDialog);
  const entityType = useSelector(selectCurrentEntityTypeDialog);
  const handleLoginOpen = () => {
    dispatch(toggleLoginDialog(entityType));
  };
  const handleRegisterOpen = () => {
    dispatch(toggleRegisterDialog(undefined));
  };

  // Component Logic
  const steps = [
    'Osnovne informacije',
    'Dodatne informacije',
    ...(entityType === 'Shop' ? ['Poslovne informacije', 'Radni Sati'] : []),
  ];
  const theme = createTheme();
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Credentials setUser={setUser} user={user} entityType={entityType} />
        );
      case 1:
        return <ProfileInfo setUser={setUser} user={user} />;
      case 2:
        if (entityType === 'Shop')
          return (
            <CompanyInfo
              setUser={setUser as Dispatch<SetStateAction<IShop>>}
              user={user as IShop}
            />
          );
        break;
      case 3:
        if (entityType === 'Shop')
          return (
            <WorkingHours
              setUser={setUser as Dispatch<SetStateAction<IShop>>}
              user={user as IShop}
            />
          );
        break;
      default:
        throw new Error('Unknown step');
    }
  };
  const initialEntity = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    workingHours: {
      workingDays: { start: '', finish: '' },
      saturday: { start: '', finish: '' },
      sunday: { start: '', finish: '' },
    },
    password: '',
    confirmPassword: '',
  };
  const [user, setUser] = useState<IRegisterUser | IShop>(initialEntity);

  const [register, { isSuccess, isError, error }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      handleNext();
      // Opening Login Dialog
      setTimeout(() => {
        setActiveStep(0);
        handleRegisterOpen();
        handleLoginOpen();
        setUser(initialEntity);
      }, 8000);
    }
    if (isError) {
      dispatch(
        setFeedback({
          open: true,
          message: `Niste se uspešno registrovali, proverite da li ste sve uradili što je neophodno ili kontaktirajte admina za pomoć! ${error}`,
          time: 3000,
          severity: 'error',
        })
      );
      setActiveStep(0);
    }
    // eslint-disable-next-line
  }, [isSuccess, isError, error, dispatch]);

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await register({ entity: user, entityType });
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isRegisterOpen} onClose={handleRegisterOpen}>
        <DialogContent>
          <CssBaseline />
          <Container component='main' maxWidth='sm' sx={{ mb: 1 }}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
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
                      mb: theme.spacing(2),
                      backgroundColor: '#ab47bc',
                    }}
                  >
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component='h1' variant='h5'>
                    Registruj novi nalog
                  </Typography>
                </Box>
              </DialogTitle>
              <Stepper
                activeStep={activeStep}
                sx={{
                  pt: 1,
                  pb: 3,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: '#ab47bc',
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: '#ab47bc',
                      },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep !== steps.length ? (
                <Fragment>
                  {getStepContent(activeStep)}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep !== 0 && (
                      <Button
                        onClick={handleBack}
                        sx={{
                          mt: 3,
                          ml: 1,
                          color: '#ab47bc',
                        }}
                        className='bu'
                      >
                        Nazad
                      </Button>
                    )}

                    <Button
                      variant='contained'
                      onClick={(e) =>
                        activeStep === steps.length - 1
                          ? handleSubmit(e)
                          : handleNext()
                      }
                      sx={{
                        mt: 3,
                        ml: 1,
                        backgroundColor: theme.palette.secondary.main,
                      }}
                      className='registracija-dalje-button'
                    >
                      {activeStep === steps.length - 1
                        ? 'Registracija'
                        : 'Dalje'}
                    </Button>
                  </Box>
                </Fragment>
              ) : (
                <div style={{ position: 'relative', height: '5vh' }}>
                  <Loading />
                </div>
              )}
            </Paper>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                {activeStep != steps.length && (
                  <Button
                    sx={{
                      fontSize: 12,
                      marginTop: theme.spacing(1),

                      color: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: 'inherit',
                      },
                    }}
                    className='prijava-button'
                    onClick={handleLoginOpen}
                  >
                    Već imaš nalog? Prijavi se ovde!
                  </Button>
                )}

                <Copyright mt={2} />
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};
export default Register;
