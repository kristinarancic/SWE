import { Grid, Avatar } from '@mui/material';
import {
  handleChange,
  handleResidenceChange,
  handleImageUpload,
} from '../../helpers/utils';

import Input from '../Input';

import { IRegisterUser, IShop } from '../../helpers/Interfaces';

type UserStateProps = {
  user: IRegisterUser | IShop;
  setUser: React.Dispatch<React.SetStateAction<IRegisterUser | IShop>>;
};

const ProfileInfo = ({ user, setUser }: UserStateProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setUser, user);
  };
  const handleResidenceOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleResidenceChange(e, setUser, user);
  };
  return (
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
          onChange={(e) => handleImageUpload(e, setUser, user)}
        />
      </Grid>
      <Input
        name='phone'
        label='Broj Telefona'
        type='text'
        autoComplete='phone'
        handleChange={handleInputChange}
        autoFocus={true}
      />
      <Input
        name='address'
        label='Adresa'
        type='text'
        autoComplete='address-line'
        handleChange={handleResidenceOnChange}
      />
      <Input
        name='city'
        label='Grad'
        type='text'
        autoComplete='shipping address-level2'
        handleChange={handleResidenceOnChange}
        half
      />
      <Input
        name='zip'
        label='Zip / Poštanski Broj'
        type='text'
        autoComplete='shipping postal-cod'
        handleChange={handleResidenceOnChange}
        half
      />
    </Grid>
  );
};

export default ProfileInfo;
