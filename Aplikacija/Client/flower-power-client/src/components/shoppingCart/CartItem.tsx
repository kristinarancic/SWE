import { IProduct } from '../helpers/Interfaces';
import './ShoppingCart.css';
import productImage from '../../images/defaultPhoto.jpg';
import { Button } from 'style-components';
import {
  useAddProductsToPurchaseMutation,
  useDecreaseProductsFromPurchaseMutation,
  useRemoveProductFromPurchaseMutation,
} from '../../services/Purchase/purchaseApiSlice';
import Loading from '../helpers/Loading';

interface Props {
  product: IProduct;
  currentQuantity: number;
  purchaseId: string;
}
const CartItem: React.FC<Props> = ({
  product,
  currentQuantity,
  purchaseId,
}) => {
  const [addProductsToPurchase, { isLoading, isSuccess, isUninitialized }] =
    useAddProductsToPurchaseMutation();
  const [
    decreaseProductsFromPurchase,
    {
      isLoading: isLoading1,
      isSuccess: isSuccess1,
      isUninitialized: isUninitialized1,
    },
  ] = useDecreaseProductsFromPurchaseMutation();
  const [
    removeProductFromPurchase,
    {
      isLoading: isLoading2,
      isSuccess: isSuccess2,
      isUninitialized: isUninitialized2,
    },
  ] = useRemoveProductFromPurchaseMutation();

  const handleAddQuantity = async () => {
    await addProductsToPurchase({ id: purchaseId, productId: product.id });
  };
  const handleRemoveQuantity = async () => {
    await decreaseProductsFromPurchase({
      id: purchaseId,
      productId: product.id,
    });
  };
  const handleRemoveProduct = async () => {
    await removeProductFromPurchase({
      id: purchaseId,
      productId: product.id,
    });
  };

  return (
    <>
      {isLoading || isLoading1 || isLoading2 ? (
        <div
          style={{
            position: 'relative',
            height: '200px',
            width: '100px',
            transform: 'translate(50%, 0)',
          }}
        >
          <Loading />
        </div>
      ) : (
        (isUninitialized ||
          isUninitialized1 ||
          isUninitialized2 ||
          isSuccess ||
          isSuccess1 ||
          isSuccess2) && (
          <>
            <div className='container-cartItem'>
              <img
                className='photo-shopping-cart'
                src={product.photo ? product.photo : productImage}
                alt={product.name}
              />
              <div className='info-cartItem'>
                {product.name}
                <div>{product.price} RSD</div>
              </div>
              <div className='button-CartItem'>
                <Button
                  className='button-product-cart'
                  onClick={handleRemoveQuantity}
                  disabled={currentQuantity <= 1}
                >
                  -
                </Button>
                <p className='cart-quantity'>{currentQuantity}</p>
                <Button
                  className='button-product-cart'
                  onClick={handleAddQuantity}
                  disabled={currentQuantity >= product.quantity}
                >
                  +
                </Button>
              </div>
              <Button
                className='button-remove-product-cart'
                onClick={handleRemoveProduct}
              >
                Ukloni
              </Button>
            </div>
          </>
        )
      )}
    </>
  );
};

export default CartItem;
