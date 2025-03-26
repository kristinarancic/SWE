import { useNavigate, useParams } from 'react-router-dom';
import './Products.css';
import { Button } from '@mui/base';
import { RootState } from '../../../../services/store';
import { useSelector } from 'react-redux';
import productImage from '../../../../images/defaultPhoto.jpg';
import {
  selectAllProducts,
  selectNumberOfPages,
} from '../../../../services/Products/productsApiSlice';

import { IShop, IUser } from '../../../helpers/Interfaces';
import useAuth from '../../../../services/Auth/AuthFeatures/useAuth';
import { toggleAddProductsDialog } from '../../../../services/Dialog/dialogSlice';
import { useDispatch } from 'react-redux';
import AddProducts from './AddProducts';

const Products = () => {
  const { id, productsPage } = useParams();
  const dispatch = useDispatch();
  const currentPage = productsPage ? parseInt(productsPage) : 1;
  const { id: _id } = useAuth() as IShop | IUser;
  const isCurrentShop = id === _id ? true : false;
  const products = useSelector((state: RootState) =>
    selectAllProducts(state, id as string, currentPage)
  );
  const numberOfPages = useSelector((state: RootState) =>
    selectNumberOfPages(state, id as string, currentPage)
  );
  const isLastPage = numberOfPages === currentPage ? true : false;
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/shop/${id}/${currentPage}/product/${productId}`);
  };

  return (
    <>
      <AddProducts />
      <section id='Proizvodi' className='proizvodi-sekcija'>
        <div className='container'>
          <h1 className='product-product'>Proizvodi</h1>
          <div className='product-grid'>
            {products.map((product) => {
              return (
                <div key={product.id} className='product-card'>
                  <img
                    className='product-img'
                    src={product.photo ? product.photo : productImage}
                    alt={product.name}
                  />
                  <div className='text-product'>
                    <h2 className='product-name'>{product.name}</h2>
                    <h4 className='price'>{product.price} RSD</h4>
                  </div>
                  <Button
                    className='button-visitShop'
                    onClick={() => handleProductClick(product.id)}
                  >
                    Pogledaj proizvod
                  </Button>
                </div>
              );
            })}
          </div>
          <div className='buttons-products'>
            {!isLastPage && (
              <Button
                className='show-more'
                onClick={() => {
                  navigate(`/shop/${id}/${currentPage + 1}`);
                }}
              >
                Prikazi više
              </Button>
            )}
            {currentPage !== 1 && (
              <Button
                className='show-more'
                onClick={() => {
                  navigate(`/shop/${id}/${currentPage - 1}`);
                }}
              >
                Nazad
              </Button>
            )}
            {isCurrentShop && (
              <Button
                className='add-or-change'
                onClick={() => {
                  dispatch(toggleAddProductsDialog());
                }}
              >
                Dodaj ili promeni proizvode
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
