import {
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  InputProps,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface CustomInputProps extends InputProps {
  endAdornment?: JSX.Element;
}
interface MyInputProps {
  name: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleShowPassword?: () => void;
  label: string;
  half?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  type: string;
  multiline?: boolean;
  maxRows?: number;
  defaultValue?: string | number | null;
  autoComplete?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}
const Input: React.FC<MyInputProps> = ({
  name,
  handleChange,
  handleShowPassword,
  label,
  half,
  autoFocus,
  type,
  multiline,
  maxRows,
  defaultValue,
  autoComplete,
  required,
  error,
  helperText,
  disabled,
}) => {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        name={name}
        onChange={handleChange}
        variant='standard'
        required={required}
        fullWidth
        label={label}
        autoFocus={autoFocus}
        color='secondary'
        type={type}
        multiline={multiline}
        maxRows={maxRows}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        error={error}
        helperText={helperText}
        disabled={disabled}
        InputProps={
          name === 'password'
            ? ({
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleShowPassword}>
                      {type === 'password' ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              } as CustomInputProps)
            : undefined
        }
      ></TextField>
    </Grid>
  );
};

export default Input;
