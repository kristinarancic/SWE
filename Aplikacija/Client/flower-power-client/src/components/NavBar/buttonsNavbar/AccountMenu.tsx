import React, { useEffect, useState } from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Logout from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../../../services/Auth/authApiSlice';

import useAuth from '../../../services/Auth/AuthFeatures/useAuth';
import { IUser, IShop } from '../../helpers/Interfaces';
import EmailIcon from '@mui/icons-material/Email';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const [sendLogout, { isSuccess }] = useSendLogoutMutation();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  const handleLogout = () => {
    sendLogout(null);
    // Navigate to home page
    navigate('/');
  };
  const handleMyAccount = () => {
    role === 'Buyer' || role === 'Admin'
      ? navigate(`/userprofile/${id}`)
      : role === 'Shop'
      ? navigate(`/shop/${id}`)
      : null;
  };

  const entityInfo = useAuth();
  const { id, role, photo } = entityInfo as IUser | IShop;

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              src={photo as string}
              sx={{ width: 32, height: 32 }}
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMyAccount} sx={{ color: '#ab47bc' }}>
          <ListItemIcon>
            <ManageAccountsIcon fontSize='medium' sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          Moj nalog
        </MenuItem>
        <MenuItem sx={{ color: '#ab47bc' }}>
          <ListItemIcon>
            <NotificationsIcon fontSize='medium' sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          Notifikacije
        </MenuItem>
        <MenuItem sx={{ color: '#ab47bc' }}>
          <ListItemIcon>
            <EmailIcon fontSize='medium' sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          Poruke
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: '#ab47bc' }}>
          <ListItemIcon>
            <Logout fontSize='medium' sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          Odjavi se
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
