import { Grid } from '@mui/material';
import { useState } from 'react';
import Input from '../Input';
import { handleChange, handleShowPassword } from '../../helpers/utils';
import { IRegisterUser, IShop } from '../../helpers/Interfaces';

type UserStateProps = {
  user: IRegisterUser | IShop;
  setUser: React.Dispatch<React.SetStateAction<IRegisterUser | IShop>>;
  entityType: 'User' | 'Shop' | undefined;
};

const Credentials = ({ setUser, user, entityType }: UserStateProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setUser, user);
  };
  return (
    <Grid container spacing={2}>
      {entityType === 'User' ? (
        <>
          <Input
            name='firstName'
            label='Ime'
            autoFocus
            type='text'
            handleChange={handleInputChange}
            half
            required
          />
          <Input
            name='lastName'
            label='Prezime'
            type='text'
            handleChange={handleInputChange}
            half
            required
          />
        </>
      ) : (
        <Input
          name='name'
          label='Ime Prodavnice'
          type='text'
          handleChange={handleInputChange}
          required
        />
      )}

      <Input
        name='email'
        label='Email Adresa'
        type='email'
        handleChange={handleInputChange}
        required
      />
      <Input
        name='password'
        label='Šifra'
        type={showPassword ? 'text' : 'password'}
        handleChange={handleInputChange}
        handleShowPassword={() => {
          handleShowPassword(setShowPassword);
        }}
        required
      />

      <Input
        name='confirmPassword'
        label='Ponovi Šifru'
        handleChange={handleInputChange}
        type='password'
        required
      />
    </Grid>
  );
};

export default Credentials;
