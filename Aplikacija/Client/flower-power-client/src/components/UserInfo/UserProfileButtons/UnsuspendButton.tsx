import { useEffect } from 'react';
import { Button } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useUnsuspendUserMutation } from '../../../services/Users/usersApiSlice';
import { IUser } from '../../helpers/Interfaces';

import { setFeedback } from '../../../services/Feedback/feedbackSlice';
import { useDispatch } from 'react-redux';

type UnsuspendButtonProps = {
  _id: string | undefined;
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
};
const UnsuspendButton = ({ _id, user, setUser }: UnsuspendButtonProps) => {
  const nameColor = '#414141';
  const dispatch = useDispatch();

  const [unsuspendUser, { isSuccess, isError, isLoading, error }] =
    useUnsuspendUserMutation();

  useEffect(() => {
    if (isError) {
      console.log(error);
      dispatch(
        setFeedback({
          open: true,
          message:
            'Nalog korisnika nije uspešno aktiviran! Molim pokušajte ponovo ili kontaktirajte nadređenog!',
          time: 2000,
          severity: 'error',
        })
      );
    }
    if (isLoading) {
      return;
    }

    if (isSuccess) {
      dispatch(
        setFeedback({
          open: true,
          message: 'Nalog korisnika je uspešno aktiviran!',
          time: 2000,
          severity: 'success',
        })
      );
    }
  }, [isError, isLoading, isSuccess, error, dispatch]);
  const handleClick = async () => {
    const res = await unsuspendUser({ _id: _id, userId: user.id });
    // If isSuccess
    if ('data' in res) {
      setUser({ ...user, suspended: false });
    }
  };

  return (
    <Button
      variant='text'
      sx={{ color: nameColor }}
      startIcon={<VerifiedIcon />}
      onClick={handleClick}
    >
      Aktiviraj
    </Button>
  );
};
export default UnsuspendButton;
