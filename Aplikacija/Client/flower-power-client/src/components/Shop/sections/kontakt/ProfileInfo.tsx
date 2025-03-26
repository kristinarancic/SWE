import { Grid, Avatar } from '@mui/material';
import {
  handleChange,
  handleResidenceChange,
  handleImageUpload,
} from '../../../helpers/utils';
import { IShop } from '../../../helpers/Interfaces';

import Input from '../../../UserAuth/Input';

type ShopStateProps = {
  shop: IShop;
  setShop: React.Dispatch<React.SetStateAction<IShop>>;
};

const ProfileInfo = ({ shop, setShop }: ShopStateProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setShop, shop);
  };
  const handleResidenceOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleResidenceChange(e, setShop, shop);
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
            src={shop.photo}
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
          onChange={(e) => handleImageUpload(e, setShop, shop)}
        />
      </Grid>
      <Input
        name='name'
        label='Ime Prodavnice'
        type='text'
        defaultValue={shop.name}
        handleChange={handleInputChange}
        autoFocus={true}
      />
      <Input
        name='phone'
        label='Broj Telefona'
        type='text'
        defaultValue={shop.phone}
        handleChange={handleInputChange}
      />

      <Input
        name='address'
        label='Adresa'
        type='text'
        defaultValue={shop.residence?.address}
        handleChange={handleResidenceOnChange}
      />

      <Input
        name='city'
        label='Grad'
        type='text'
        defaultValue={shop.residence?.city}
        handleChange={handleResidenceOnChange}
        half
      />

      <Input
        name='zip'
        label='Zip / Poštanski Broj'
        type='text'
        defaultValue={shop.residence?.zip}
        handleChange={handleResidenceOnChange}
        half
      />

      <Input
        name='facebook'
        label='Facebook Nalog'
        type='text'
        defaultValue={shop.facebook}
        handleChange={handleInputChange}
      />
      <Input
        name='instagram'
        label='Instagram Nalog'
        type='text'
        defaultValue={shop.instagram}
        handleChange={handleInputChange}
      />
    </Grid>
  );
};

export default ProfileInfo;
