import React from 'react';
import './Onama.css';
import { toggleChangeShopDescriptionDialog } from '../../../../services/Dialog/dialogSlice';
import { Button } from 'style-components';
import aboutUs1 from '../../../../images/aboutUs1.jpg';
import aboutUs2 from '../../../../images/aboutUs2.jpg';
import aboutUs3 from '../../../../images/aboutUs3.jpg';
import aboutUs4 from '../../../../images/aboutUs4.jpg';
import { useDispatch } from 'react-redux';
import ChangeShopDescription from './ChangeShopDescription';
import { useGetRandomImagesQuery } from '../../../../services/Products/productsApiSlice';

interface RoleChecker {
  description: string | undefined;
  isCurrent: boolean;
  shopId: string;
}

const Onama: React.FC<RoleChecker> = ({ description, isCurrent, shopId }) => {
  const dispatch = useDispatch();
  const handleChangeDescription = () => {
    dispatch(toggleChangeShopDescriptionDialog());
  };

  const { data: images } = useGetRandomImagesQuery(shopId);

  return (
    <>
      <ChangeShopDescription />
      <section id='O-nama' className='Onama'>
        <div className='aboutus-text'>
          <h1 className='onama-shop'>O nama</h1>
          <p className='p-shop'>{description}</p>
          {isCurrent && (
            <Button className='dugme-opis' onClick={handleChangeDescription}>
              Promeni opis
            </Button>
          )}
        </div>
        <div className='aboutus-photos'>
          <div className='div-image-aboutus'>
            <img src={images?.[0] || aboutUs1} alt={aboutUs1} />
            <img src={images?.[1] || aboutUs2} alt={aboutUs2} />
          </div>
          <div className='div-image-aboutus'>
            <img src={images?.[2] || aboutUs3} alt={aboutUs3} />
            <img src={images?.[3] || aboutUs4} alt={aboutUs4} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Onama;
