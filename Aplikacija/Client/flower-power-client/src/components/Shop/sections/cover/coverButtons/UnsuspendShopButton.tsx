import { useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import '../CoverPhoto.css';
import { useUnsuspendShopMutation } from '../../../../../services/Shops/shopsApiSlice';
import { IShop } from '../../../../helpers/Interfaces';

import { setFeedback } from '../../../../../services/Feedback/feedbackSlice';
import { useNavigate } from 'react-router-dom';

type UnsuspendButtonProps = {
  _id: string | undefined;
  shop: IShop;
};
const UnsuspendButton = ({ _id, shop }: UnsuspendButtonProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unsuspendShop, { isSuccess, isError, isLoading, error }] =
    useUnsuspendShopMutation();

  useEffect(() => {
    if (isError) {
      console.log(error);
      dispatch(
        setFeedback({
          open: true,
          message:
            'Nalog prodavnice nije uspešno aktiviran! Molim pokušajte ponovo ili kontaktirajte nadređenog!',
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
          message: 'Nalog prodavnice uspešno aktiviran!',
          time: 2000,
          severity: 'success',
        })
      );
      // Promeni
      navigate(0);
    }
  }, [isError, isLoading, isSuccess, error, dispatch, navigate]);

  const handleClick = async () => {
    await unsuspendShop({ _id: _id, shopId: shop.id });
  };
  return (
    <Button variant='text' className='contact-button' onClick={handleClick}>
      Aktiviraj cvećaru
    </Button>
  );
};
export default UnsuspendButton;
