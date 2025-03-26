import React, { useEffect, useState } from 'react';
import {
  Grid,
  Dialog,
  DialogContent,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import Input from '../../../UserAuth/Input';

import Loading from '../../../helpers/Loading';
import { IShop } from '../../../helpers/Interfaces';
import useAuth from '../../../../services/Auth/AuthFeatures/useAuth';
import { useUpdateShopDescriptionMutation } from '../../../../services/Shops/shopsApiSlice';
import { setFeedback } from '../../../../services/Feedback/feedbackSlice';
import {
  selectCurrentChangeShopDescriptionDialog,
  toggleChangeShopDescriptionDialog,
} from '../../../../services/Dialog/dialogSlice';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

const ChangeShopDescription = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const open = useSelector(selectCurrentChangeShopDescriptionDialog);

  // User Logic
  const { id, description } = useAuth() as IShop;

  const [desc, setDesc] = useState<string | undefined>(description);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  // Update store
  const [updateShopDescription, { isLoading, isSuccess, isError, error }] =
    useUpdateShopDescriptionMutation();

  // Waiting for server response
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

  // Submit Logic
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    await updateShopDescription({ id, description: desc });
    dispatch(toggleChangeShopDescriptionDialog());
  };

  return isLoading ? (
    <Loading />
  ) : (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(toggleChangeShopDescriptionDialog());
        }}
      >
        <DialogContent>
          <Container
            component='main'
            maxWidth='sm'
            sx={{ mb: 1, p: { xs: 2, md: 3 } }}
          >
            <Typography
              variant='h5'
              textAlign='center'
              mb={3}
              fontWeight='bold'
            >
              Ažuriraj opis prodavnice!
            </Typography>

            <Grid container spacing={3}>
              <Input
                name='description'
                label='Opis'
                autoFocus
                type='text'
                multiline
                maxRows={15}
                handleChange={handleChange}
                defaultValue={description}
              />

              <Grid item ml='auto'>
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                >
                  Ažuriraj
                </Button>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default ChangeShopDescription;
