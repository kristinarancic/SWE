import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Avatar,
  Dialog,
  DialogContent,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import Input from '../../../components/UserAuth/Input';
import {
  handleChange,
  handleImageUpload,
  handleChangeSelect,
} from '../../../components/helpers/utils';
import { IProduct } from '../../../components/helpers/Interfaces';
import Loading from '../../../components/helpers/Loading';

import { RootState } from '../../../services/store';
import { setFeedback } from '../../../services/Feedback/feedbackSlice';
import {
  useUpdateProductMutation,
  selectProductById,
} from '../../../services/Products/productsApiSlice';
import {
  selectCurrentEditProductDialog,
  toggleEditProductDialog,
} from '../../../services/Dialog/dialogSlice';

const EditProduct = () => {
  const { id, productId, productsPage } = useParams();
  const currentPage = productsPage ? parseInt(productsPage) : 1;
  const theme = createTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const open = useSelector(selectCurrentEditProductDialog);

  // Product Logic
  const currentProduct = useSelector((state: RootState) =>
    selectProductById(state, id as string, productId as string, currentPage)
  );

  const [product, setProduct] = useState<IProduct>(currentProduct);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setProduct, product);
  };

  const [selected, setSelected] = useState('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setSelected(event.target.value);
    handleChangeSelect(event, setProduct, product);
  };

  // Update store
  const [updateProduct, { isLoading, isSuccess, isError, error }] =
    useUpdateProductMutation();

  // Waiting for server response
  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
    if (isError)
      dispatch(
        setFeedback({
          open: true,
          message: `Vaši podaci nisu uspešno ažurirani!\n${
            (error as any)?.data?.message
          }`,
          time: 3000,
          severity: 'error',
        })
      );
  }, [isSuccess, isError, error, navigate, dispatch]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const error = await handleImageUpload(e, setProduct, product);
    error &&
      dispatch(
        setFeedback({
          open: true,
          message: error,
          time: 3000,
          severity: 'error',
        })
      );
  };

  // Submit Logic
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    await updateProduct({ product });
    dispatch(toggleEditProductDialog());
  };

  return isLoading ? (
    <Loading />
  ) : (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(toggleEditProductDialog());
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
              Ažuriraj podatke o proizvodu
            </Typography>

            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <label
                  htmlFor='photo'
                  style={{ borderRadius: '50%', cursor: 'pointer' }}
                >
                  <Avatar
                    sx={{ width: 150, height: 150, htmlFor: 'photo' }}
                    src={product.photo}
                  />
                </label>
                <input
                  hidden
                  type='file'
                  required
                  id='photo'
                  name='photo'
                  accept='image/*'
                  autoComplete='picture'
                  onChange={handleUpload}
                />
              </Grid>

              <Input
                name='name'
                label='Ime proizvoda'
                autoFocus
                type='text'
                handleChange={handleInputChange}
                defaultValue={product.name}
              />
              <Input
                name='price'
                label='Cena proizvoda'
                type='email'
                handleChange={handleInputChange}
                defaultValue={product.price}
                half
              />
              <Input
                name='quantity'
                label='Trenutno na stanju'
                type='number'
                half
                handleChange={handleInputChange}
                defaultValue={product.quantity}
              />

              <div
                style={{ margin: '13px', width: '100%', marginRight: '10px' }}
              >
                <select
                  defaultValue={product.type ? product.type : ''}
                  name='type'
                  onChange={handleSelectChange}
                  style={{
                    width: '100%',
                    marginTop: '15px',
                    marginLeft: '10px',
                    height: '100%',
                  }}
                  // value={selected}
                  //Ako ovo odkomentarisemo, svaki put i kada ima i kada nema type pise --Izaberi tip--
                >
                  <option value=''>--Izaberi tip--</option>
                  <option value='Drugo'>Drugo</option>
                  <option value='Buket'>Buket</option>
                  <option value='Svadbeni cvetni aranžman'>
                    Svadbeni cvetni aranžman
                  </option>
                  <option value='Pogrebni cvetni aranžman'>
                    Pogrebni cvetni aranžman
                  </option>
                  <option value='Sobno saksijsko cveće'>
                    Sobno saksijsko cveće
                  </option>
                  <option value='Spoljno saksijsko cveće'>
                    Spoljno saksijsko cveće
                  </option>
                </select>
              </div>

              <Input
                name='description'
                label='Opis proizvoda'
                type='text'
                handleChange={handleInputChange}
                defaultValue={product.description}
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

export default EditProduct;
