import './Product.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProductById } from '../../../services/Products/productsApiSlice';
import {
  toggleEditProductDialog,
  toggleLoginDialog,
} from '../../../services/Dialog/dialogSlice';
import Footer from '../../../components/Footer/Footer';
import { Button } from 'style-components';
import { RootState } from '../../../services/store';
import productImage from '../../../images/defaultPhoto.jpg';
import useAuth from '../../../services/Auth/AuthFeatures/useAuth';
import { useDispatch } from 'react-redux';
import { IProduct, IShop, IUser } from '../../../components/helpers/Interfaces';
import { useEffect } from 'react';
import EditProduct from './EditProduct';
import {
  useAddProductsToPurchaseMutation,
  useCreatePurchaseMutation,
  useGetPurchaseQuery,
} from '../../../services/Purchase/purchaseApiSlice';
import { toggleClearCartDialog } from '../../../services/Dialog/dialogSlice';
import { setFeedback } from '../../../services/Feedback/feedbackSlice';
import ClearShopingCart from './ClearShopDialog';
import { isBuyerOrGuest } from '../../../components/helpers/roleConditionals';

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, productId, productsPage } = useParams();
  const currentPage = productsPage ? parseInt(productsPage) : 1;
  const { role, id: _id } = useAuth() as IUser | IShop;

  const isCurrentShop = id === _id ? true : false;

  const product: IProduct = useSelector((state: RootState) =>
    selectProductById(state, id as string, productId as string, currentPage)
  );

  useEffect(() => {
    if (!product) {
      navigate(-1); // Navigate back to the previous page if product is not found in the Redux store
    }
  }, [navigate, product]);

  // Cart Logic
  const { data: purchase } = useGetPurchaseQuery(_id);
  const [createPurchase, { isSuccess, isError, error }] =
    useCreatePurchaseMutation();

  const [
    addProductsToPurchase,
    { isSuccess: isSuccess1, isError: isError1, error: error1 },
  ] = useAddProductsToPurchaseMutation();

  const handleAddToCart = async () => {
    if (purchase?.shop && purchase?.shop !== id) {
      dispatch(toggleClearCartDialog());
    } else if (role === 'Guest') {
      dispatch(toggleLoginDialog('User'));
    } else if (!purchase?.id)
      await createPurchase({
        id: _id,
        products: [{ product: product, quantity: 1 }],
      });
    else if (role === 'Buyer' && productId)
      await addProductsToPurchase({ id: purchase.id, productId });
  };

  useEffect(() => {
    if (isSuccess || isSuccess1) {
      dispatch(
        setFeedback({
          open: true,
          message: 'Uspešno ste dodali proizvod u korpu!',
          time: 2000,
          severity: 'success',
        })
      );
    }
    if (isError || isError1) {
      dispatch(
        setFeedback({
          open: true,
          message: `Greška! ${error || error1}`,
          time: 2000,
          severity: 'error',
        })
      );
    }
  }, [isSuccess, isSuccess1, dispatch, isError, isError1, error, error1]);

  return (
    <>
      {purchase && <ClearShopingCart purchaseId={purchase.id} />}
      <EditProduct />
      <div className='product-page'>
        <div className='product-container'>
          <div className='image-div-product'>
            <div className='image-div-product'>
              <img
                src={product.photo ? product.photo : productImage}
                alt={product.name}
              />
            </div>
          </div>
          <div className='about-product'>
            <div className='name-and-type-product'>
              <h1 className='product-page-name'>{product.name}</h1>
              <span>{product.type}</span>
              <h2 className='price-product'>{product.price} RSD</h2>
              <h3 className='product-quantity'>
                Na stanju: {product.quantity}
              </h3>
            </div>
            <div className='product-description'>
              <p className='product-description-p'>{product.description}</p>
              <div className='button-amount'>
                {isCurrentShop ? (
                  <Button
                    className='product-page-button-cart'
                    onClick={() => {
                      dispatch(toggleEditProductDialog());
                    }}
                  >
                    Ažuriraj proizvod
                  </Button>
                ) : (
                  isBuyerOrGuest(role) && (
                    <Button
                      className='product-page-button-cart'
                      onClick={handleAddToCart}
                      disabled={
                        purchase?.products?.find(
                          (p) => p.product.id === product.id
                        )?.quantity === product.quantity
                      }
                    >
                      Dodaj u korpu
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Product;
