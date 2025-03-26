import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Onama from '../../components/Shop/sections/o-nama/Onama';
import useAuth from '../../services/Auth/AuthFeatures/useAuth';
import CoverPhoto from '../../components/Shop/sections/cover/CoverPhoto';
import Products from '../../components/Shop/sections/proizvodi/Products';
import Contact from '../../components/Shop/sections/kontakt/Contact';
import Reviews from '../../components/Recenzije/Reviews';
import {
  IContact,
  IShop,
  IUser,
  IWorkingHours,
} from '../../components/helpers/Interfaces';

import { selectShopById } from '../../services/Shops/shopsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import Loading from '../../components/helpers/Loading';

const Shop = () => {
  // Setting shop logic
  const { id } = useParams();
  const currentEntity = useAuth() as IShop | IUser;
  const isCurrentShop = id === currentEntity.id ? true : false;

  const selectorShop = useSelector((state: RootState) =>
    selectShopById(state, 1, id as string)
  );

  let shop: IShop;
  isCurrentShop
    ? (shop = currentEntity as IShop)
    : (shop = selectorShop as IShop);

  if (!selectorShop) {
    return <Loading />;
  }
  let contact: IContact = {} as IContact;
  let workingHours: IWorkingHours = {} as IWorkingHours;
  // Setting contact logic
  if (shop) {
    contact = {
      email: shop.email,
      phone: shop.phone,
      residence: shop.residence,
      facebook: shop.facebook,
      instagram: shop.instagram,
      workingHours: shop.workingHours,
    };
    workingHours = {
      workingDays: {
        start: shop.workingHours?.workingDays?.start || '',
        finish: shop.workingHours?.workingDays?.finish || '',
      },
      saturday: {
        start: shop.workingHours?.saturday?.start || '',
        finish: shop.workingHours?.saturday?.finish || '',
      },
      sunday: {
        start: shop.workingHours?.sunday?.start || '',
        finish: shop.workingHours?.sunday?.finish || '',
      },
    };
  }
  return (
    shop && (
      <>
        <CoverPhoto
          shop={shop}
          role={currentEntity.role}
          currentUser={currentEntity.id}
        />
        <Onama
          description={shop.description}
          isCurrent={isCurrentShop}
          shopId={id as string}
        />
        <Products />
        <div style={{ position: 'relative' }}>
          <Reviews role={shop.role} />
        </div>
        <Contact
          contact={contact}
          role={shop.role}
          isCurrent={isCurrentShop}
          workingHours={workingHours}
        />
        <Footer />
      </>
    )
  );
};

export default Shop;
