import { useEffect } from 'react';
import { Button } from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { useSuspendUserMutation } from '../../../services/Users/usersApiSlice';
import { IUser } from '../../helpers/Interfaces';

import { setFeedback } from '../../../services/Feedback/feedbackSlice';
import { useDispatch } from 'react-redux';

type SuspendButtonProps = {
  _id: string | undefined;
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
};
const SuspendButton = ({ _id, user, setUser }: SuspendButtonProps) => {
  const nameColor = '#414141';
  const dispatch = useDispatch();
  const [suspendUser, { isSuccess, isError, isLoading, error }] =
    useSuspendUserMutation();

  useEffect(() => {
    if (isError) {
      console.log(error);
      dispatch(
        setFeedback({
          open: true,
          message:
            'Nalog korisnika nije uspešno suspendovan! Molim pokušajte ponovo ili kontaktirajte nadređenog!',
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
          message: 'Nalog korisnika uspešno suspendovan!',
          time: 2000,
          severity: 'success',
        })
      );
    }
  }, [isError, isLoading, isSuccess, error, dispatch]);

  const handleClick = async () => {
    const res = await suspendUser({ _id: _id, userId: user.id });

    // If isSuccess
    if ('data' in res) {
      setUser({ ...user, suspended: true });
    }
  };
  return (
    <Button
      variant='text'
      sx={{ color: nameColor }}
      startIcon={<DangerousIcon />}
      onClick={handleClick}
    >
      Suspenduj
    </Button>
  );
};
export default SuspendButton;
