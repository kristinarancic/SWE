import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch } from 'react-redux';
import { toggleLoginDialog } from '../../../services/Dialog/dialogSlice';
import { isBuyer, isGuest } from '../../helpers/roleConditionals';
import ShoppingCart from '../../shoppingCart/ShoppingCart';

interface ShopingCartIconProps {
  sx?: React.CSSProperties;
  role: string;
}

const ShoppingCartButton: React.FC<ShopingCartIconProps> = ({ sx, role }) => {
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleCloseDrawer = () => {
    setOpenDrawer(false); // Zatvaramo Drawer
  };

  const handleLoginOpen = (role: 'User' | 'Shop' | undefined) => {
    dispatch(toggleLoginDialog(role));
  };

  function handleShoppingCart() {
    isGuest(role) ? handleLoginOpen('User') : setOpenDrawer(true);
  }

  return (
    <>
      <IconButton
        size='medium'
        edge='start'
        color='inherit'
        aria-label='logo'
        sx={sx}
        onClick={handleShoppingCart}
      >
        <ShoppingCartOutlinedIcon />
      </IconButton>
      {isBuyer(role) && (
        <ShoppingCart
          openDrawer={openDrawer}
          onCloseDrawer={handleCloseDrawer}
        />
      )}
    </>
  );
};

export default ShoppingCartButton;
