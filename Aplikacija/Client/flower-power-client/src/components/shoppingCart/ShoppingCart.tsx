import React, { useEffect } from 'react';
import { Button, Drawer } from '@mui/material';
import './ShoppingCart.css';
import { IUser } from '../helpers/Interfaces';
import CartItem from './CartItem';
import {
  useConfirmPurchaseMutation,
  useGetPurchaseQuery,
} from '../../services/Purchase/purchaseApiSlice';
import useAuth from '../../services/Auth/AuthFeatures/useAuth';
import Loading from '../helpers/Loading';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../../services/Feedback/feedbackSlice';
import { useNavigate } from 'react-router-dom';
interface ShopingCartDrawerProps {
  openDrawer?: boolean;
  onCloseDrawer?: () => void;
}

const ShopingCart: React.FC<ShopingCartDrawerProps> = ({
  openDrawer,
  onCloseDrawer,
}) => {
  const { id } = useAuth() as IUser;
  const dispatch = useDispatch();
  const {
    data: purchase,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useGetPurchaseQuery(id);

  const [
    confirmPurchase,
    {
      isSuccess: isSuccess1,
      isLoading: isLoading1,
      isError: isError1,
      error: error1,
    },
  ] = useConfirmPurchaseMutation();

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    if (isSuccess && !isSuccess1 && purchase?.products) {
      totalPrice = purchase?.price;
    }
    return totalPrice;
  };

  const navigate = useNavigate();

  const handleVisitShop = () => {
    navigate(`/shop/${purchase?.shop}`);
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  };

  useEffect(() => {
    if (isSuccess1)
      dispatch(
        setFeedback({
          open: true,
          message:
            'Uspešno ste obavili kupovinu! Proverite notifikacije za više detalja!',
          time: 4000,
          severity: 'success',
        })
      );
  }, [isSuccess1, dispatch]);

  return (
    <React.Fragment>
      <Drawer open={openDrawer} onClose={onCloseDrawer} anchor='right'>
        <ul className='ul-drawer-shopping-cart'>
          {isLoading ||
            (isLoading1 && (
              <div style={{ position: 'relative', marginTop: '50%' }}>
                <Loading />
              </div>
            ))}
          <h2 className='shopping-cart-subject'>Korpa</h2>
          {isSuccess &&
            purchase?.products !== undefined &&
            purchase?.products.map((product, index) => (
              <CartItem
                key={index}
                product={product.product}
                purchaseId={purchase.id}
                currentQuantity={product.quantity}
              />
            ))}
          {(isError || isError1) && <div>{error || (error1 as any)}</div>}
          {isSuccess && purchase?.products !== undefined && (
            <div className='div-purchase'>
              <h4 className='total-price-purchase'>
                Ukupna cena: {calculateTotalPrice()} RSD
              </h4>
              <Button
                className='confirm-purchase'
                onClick={async () => {
                  if (purchase?.id) await confirmPurchase(purchase.id);
                }}
              >
                Potvrdi
              </Button>
              <Button
                className='purchase-shop'
                onClick={() => handleVisitShop()}
              >
                Pogledaj prodavnicu
              </Button>
            </div>
          )}
          {isSuccess && purchase?.products === undefined && (
            <h3 className='empty-shopping-cart'>Korpa je trenutno prazna</h3>
          )}
        </ul>
      </Drawer>
    </React.Fragment>
  );
};

export default ShopingCart;
