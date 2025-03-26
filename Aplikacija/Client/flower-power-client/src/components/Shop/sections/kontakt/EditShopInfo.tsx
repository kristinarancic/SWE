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
} from '@mui/material';

import './EditShopInfo.css';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentEditShopDialog,
  toggleEditShopDialog,
} from '../../../../services/Dialog/dialogSlice';
import { setFeedback } from '../../../../services/Feedback/feedbackSlice';
import { useUpdateShopMutation } from '../../../../services/Shops/shopsApiSlice';

import useAuth from '../../../../services/Auth/AuthFeatures/useAuth';

import { IShop } from '../../../helpers/Interfaces';
import Loading from '../../../helpers/Loading';

import ProfileInfo from './ProfileInfo';
import WorkingHours from './WorkingHours';

const EditShopInfo = () => {
  // Component Logic
  const steps = ['Osnovne informacije', 'Radni Sati'];
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
        return <ProfileInfo setShop={setShop} shop={shop} />;
      case 1:
        return (
          <WorkingHours
            setShop={setShop as Dispatch<SetStateAction<IShop>>}
            shop={shop as IShop}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  };

  // State logic
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector(selectCurrentEditShopDialog);
  const currentShop = useAuth();

  const [shop, setShop] = useState<IShop>(currentShop as IShop);

  const [updateShop, { isLoading, isSuccess, isError, error }] =
    useUpdateShopMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
    if (isError)
      dispatch(
        setFeedback({
          open: true,
          message: `Vaš opis nije uspešno ažuriran!\n${
            (error as any)?.data?.message
          }`,
          time: 3000,
          severity: 'error',
        })
      );
  }, [isSuccess, isError, error, navigate, dispatch]);

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await updateShop({ shop });
    dispatch(toggleEditShopDialog());
  };
  return isLoading ? (
    <Loading />
  ) : (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(toggleEditShopDialog());
        }}
      >
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
                  <Typography component='h1' variant='h5'>
                    Ažuriraj informacije o prodavnici
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
              {activeStep !== steps.length && (
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
                      {activeStep === steps.length - 1 ? 'Ažuriraj' : 'Dalje'}
                    </Button>
                  </Box>
                </Fragment>
              )}
            </Paper>
          </Container>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};
export default EditShopInfo;
