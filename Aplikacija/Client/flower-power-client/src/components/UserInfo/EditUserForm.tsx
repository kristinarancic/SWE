import React, { useEffect, useState } from 'react';
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

import Input from '../UserAuth/Input';
import {
  handleChange,
  handleResidenceChange,
  handleImageUpload,
} from '../helpers/utils';

import useAuth from '../../services/Auth/AuthFeatures/useAuth';
import { useUpdateUserMutation } from '../../services/Users/usersApiSlice';
import { setFeedback } from '../../services/Feedback/feedbackSlice';
import { selectCurrentEditUserDialog } from '../../services/Dialog/dialogSlice';
import { toggleEditUserDialog } from '../../services/Dialog/dialogSlice';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { IEditUser, IUser } from '../helpers/Interfaces';
import Loading from '../helpers/Loading';

// Promeni u store
const EditUserForm = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const open = useSelector(selectCurrentEditUserDialog);

  // User Logic
  const { firstName, lastName, email, phone, photo, residence, id } =
    useAuth() as IUser;
  const initialState: IEditUser = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    photo: photo,
    residence: residence,
  };
  const [user, setUser] = useState<IEditUser>(initialState);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setUser, user);
  };
  const handleResidenceOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleResidenceChange(e, setUser, user);
  };

  // Update store
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

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
    const error = await handleImageUpload(e, setUser, user);
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
    await updateUser({ ...user });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(toggleEditUserDialog());
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
              Ažuriraj svoje podatke
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
                    src={user.photo}
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
                name='firstName'
                label='Ime'
                autoFocus
                type='text'
                handleChange={handleInputChange}
                half
                defaultValue={firstName}
              />
              <Input
                name='lastName'
                label='Prezime'
                type='text'
                handleChange={handleInputChange}
                half
                defaultValue={lastName}
              />

              <Input
                name='email'
                label='Email Adresa'
                type='email'
                handleChange={handleInputChange}
                defaultValue={email}
              />

              <Input
                name='phone'
                label='Broj Telefona'
                type='text'
                handleChange={handleInputChange}
                defaultValue={phone}
              />

              <Input
                name='address'
                label='Adresa'
                type='text'
                handleChange={handleResidenceOnChange}
                defaultValue={residence?.address}
              />

              <Input
                half
                name='city'
                label='Grad'
                type='text'
                handleChange={handleResidenceOnChange}
                defaultValue={residence?.city}
              />

              <Input
                half
                name='zip'
                label='Zip'
                type='number'
                handleChange={handleResidenceOnChange}
                defaultValue={residence?.zip}
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

export default EditUserForm;
