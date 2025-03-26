import { Typography, Link, TypographyProps } from '@mui/material';

const Copyright = (props: TypographyProps) => {
  return (
    <Typography variant='body2' color='textSecondary' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
