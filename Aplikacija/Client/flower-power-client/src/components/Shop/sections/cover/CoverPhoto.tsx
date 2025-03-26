import React from 'react';
import './CoverPhoto.css';
import Button from '@mui/material/Button';
import coverPhoto from '../../../../images/cover.jpg';
import { isAdmin, isBuyer } from '../../../helpers/roleConditionals';
import { IShop } from '../../../helpers/Interfaces';
import SuspendButton from './coverButtons/SuspendShopButton';
import UnsuspendButton from './coverButtons/UnsuspendShopButton';

interface Props {
  shop: IShop;
  role: string;
  currentUser: string | undefined;
}

const CoverPhoto: React.FC<Props> = ({ shop, role, currentUser }) => {
  return (
    <>
      <div className='cover-photo'>
        <img
          className='cover-image'
          src={shop.photo ? shop.photo : coverPhoto}
          alt='image'
        />
        <div className='text-overlay'>
          <h1 className='heading'>{shop.name}</h1>
          {isBuyer(role) && (
            <Button className='contact-button'>Pošalji nam poruku</Button>
          )}
          {isAdmin(role) &&
            (shop.suspended ? (
              <UnsuspendButton _id={currentUser} shop={shop} />
            ) : (
              <SuspendButton _id={currentUser} shop={shop} />
            ))}
        </div>
      </div>
    </>
  );
};

export default CoverPhoto;
