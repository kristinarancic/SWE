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

import Loading from '../../../helpers/Loading';
import { IShop } from '../../../helpers/Interfaces';
import useAuth from '../../../../services/Auth/AuthFeatures/useAuth';
import { useUploadCSVMutation } from '../../../../services/Products/productsApiSlice';
import { setFeedback } from '../../../../services/Feedback/feedbackSlice';
import {
  selectCurrentAddProductsDialog,
  toggleAddProductsDialog,
} from '../../../../services/Dialog/dialogSlice';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

const AddProducts = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const open = useSelector(selectCurrentAddProductsDialog);
  // User Logic
  const { id } = useAuth() as IShop;

  const [file, setFile] = useState<File | null>();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  // Update store
  const [updateCSV, { isLoading, isError, error }] = useUploadCSVMutation();

  // Waiting for server response
  useEffect(() => {
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
  }, [isError, error, navigate, dispatch]);

  // Submit Logic
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('file', file);
      await updateCSV(formData);
      dispatch(toggleAddProductsDialog());
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(toggleAddProductsDialog());
        }}
      >
        <DialogContent>
          <Container
            component='main'
            maxWidth='sm'
            sx={{ mb: 1, p: { xs: 2, md: 3 } }}
          >
            <Typography
              color={'#ab47bc'}
              variant='h5'
              textAlign='center'
              mb={3}
              fontWeight='bold'
            >
              Dodaj CSV Fajl i ažuriraj svoj asortiman
            </Typography>

            <Typography
              variant='h6'
              fontStyle={'oblique'}
              fontSize={'80%'}
              textAlign='justify'
              mb={3}
              fontWeight='semibold'
            >
              Potrebno je da CSV fajl sadrži sledeće informacije: name, price,
              type, description, quantity, photo. Bitno je naglasiti da polje
              "photo" može ostati prazno, u tom slučaju na kraju treba ostaviti
              ",", u suprotnom se slika mora konvertovati u base64. Napomena:
              Opis ne sme imati zareze!
            </Typography>

            <Grid container spacing={3}>
              <Grid item>
                <input
                  type='file'
                  id='csv-file-input'
                  accept='.csv'
                  onChange={handleChange}
                />
              </Grid>
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

export default AddProducts;
