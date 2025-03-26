import { useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import '../CoverPhoto.css';
import { useSuspendShopMutation } from '../../../../../services/Shops/shopsApiSlice';
import { IShop } from '../../../../helpers/Interfaces';

import { setFeedback } from '../../../../../services/Feedback/feedbackSlice';
import { useNavigate } from 'react-router-dom';

type SuspendButtonProps = {
  _id: string | undefined;
  shop: IShop;
};
const SuspendButton = ({ _id, shop }: SuspendButtonProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [suspendShop, { isSuccess, isError, isLoading, error }] =
    useSuspendShopMutation();

  useEffect(() => {
    if (isError) {
      console.log(error);
      dispatch(
        setFeedback({
          open: true,
          message:
            'Nalog prodavnice nije uspešno suspendovan! Molim pokušajte ponovo ili kontaktirajte nadređenog!',
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
          message: 'Nalog prodavnice uspešno suspendovan!',
          time: 2000,
          severity: 'success',
        })
      );
      // Promeni
      navigate(0);
    }
  }, [isError, isLoading, isSuccess, error, dispatch, navigate]);

  const handleClick = async () => {
    await suspendShop({ _id: _id, shopId: shop.id });
  };
  return (
    <Button variant='text' className='contact-button' onClick={handleClick}>
      Suspenduj cvećaru
    </Button>
  );
};
export default SuspendButton;
