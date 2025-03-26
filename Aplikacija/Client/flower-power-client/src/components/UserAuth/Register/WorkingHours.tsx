import { useState } from 'react';
import { Grid, Box, Checkbox } from '@mui/material';
import Input from '../Input';
import { handleWorkingHoursChange } from '../../helpers/utils';
import { IShop } from '../../helpers/Interfaces';

type UserStateProps = {
  user: IShop;
  setUser: React.Dispatch<React.SetStateAction<IShop>>;
};

const WorkingHours = ({ setUser, user }: UserStateProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleWorkingHoursChange(e, setUser, user);
  };

  const [checked, setChecked] = useState({
    saturday: false,
    sunday: false,
  });

  return (
    <Grid container spacing={2}>
      <Grid item sm={12}>
        <label>Ponedeljak - Petak</label>
        <Box sx={{ display: 'flex', gap: 10 }}>
          <Input
            name='workingDays_start'
            label=''
            helperText='Otvaranje'
            type='time'
            handleChange={handleInputChange}
            half
          />
          <Input
            name='workingDays_finish'
            label=''
            helperText='Zatvaranje'
            type='time'
            handleChange={handleInputChange}
            half
          />
        </Box>
      </Grid>
      <Grid item sm={12}>
        <label>Subota</label>
        <Box sx={{ display: 'flex', gap: 10 }}>
          <Input
            name='saturday_start'
            label=''
            helperText='Otvaranje'
            type='time'
            handleChange={handleInputChange}
            half
            disabled={checked.saturday}
          />
          <Input
            name='saturday_finish'
            label=''
            helperText='Zatvaranje'
            type='time'
            handleChange={handleInputChange}
            half
            disabled={checked.saturday}
          />
        </Box>
      </Grid>

      <Grid item sm={12}>
        <label>Nedelja</label>
        <Box sx={{ display: 'flex', gap: 10 }}>
          <Input
            name='sunday_start'
            label=''
            helperText='Otvaranje'
            type='time'
            handleChange={handleInputChange}
            half
            disabled={checked.sunday}
          />
          <Input
            name='sunday_finish'
            label=''
            helperText='Zatvaranje'
            type='time'
            handleChange={handleInputChange}
            half
            disabled={checked.sunday}
          />
        </Box>
        <Grid item sm={12}>
          <Checkbox
            color='secondary'
            checked={checked.saturday}
            onChange={() =>
              setChecked({ ...checked, saturday: !checked.saturday })
            }
          />
          <label>Subotom ne radimo!</label>
        </Grid>
        <Checkbox
          color='secondary'
          checked={checked.sunday}
          onChange={() => setChecked({ ...checked, sunday: !checked.sunday })}
        />
        <label>Nedeljom ne radimo!</label>
      </Grid>
    </Grid>
  );
};

export default WorkingHours;
