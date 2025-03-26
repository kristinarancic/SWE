import { Grid } from '@mui/material';
import Input from '../Input';
import { handleChange } from '../../helpers/utils';
import { IShop } from '../../helpers/Interfaces';

type UserStateProps = {
  user: IShop;
  setUser: React.Dispatch<React.SetStateAction<IShop>>;
};

const CompanyInfo = ({ setUser, user }: UserStateProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setUser, user);
  };

  return (
    <Grid container spacing={2}>
      <Input
        name='gdp'
        label='PIB'
        type='number'
        handleChange={handleInputChange}
        half
        required
      />

      <Input
        name='registrationNumber'
        label='Registracioni Broj'
        type='number'
        handleChange={handleInputChange}
        half
        required
      />
      <Input
        name='facebook'
        label='Facebook Nalog'
        type='text'
        handleChange={handleInputChange}
      />
      <Input
        name='instagram'
        label='Instagram Nalog'
        type='text'
        handleChange={handleInputChange}
      />

      <Input
        name='description'
        label='Opis Prodavnice'
        type='text'
        handleChange={handleInputChange}
        multiline
        maxRows={5}
      />
    </Grid>
  );
};

export default CompanyInfo;
