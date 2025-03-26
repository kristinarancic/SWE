import { useEffect } from 'react';
import { store } from '../store';
import { productsApiSlice, selectNumberOfPages } from './productsApiSlice';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
const PrefetchProducts = () => {
  const { id, productsPage, productId } = useParams();
  const currentPage = productsPage ? parseInt(productsPage) : 1;
  const numberOfPages = useSelector((state: RootState) =>
    selectNumberOfPages(state, id as string, currentPage)
  );
  useEffect(() => {
    if (id) {
      const products = store.dispatch(
        productsApiSlice.endpoints.getProducts.initiate({
          id,
          page: currentPage,
        })
      );
      return () => {
        products.unsubscribe();
      };
    }
  }, [id, currentPage]);
  if (
    productsPage !== undefined &&
    (currentPage > numberOfPages || currentPage < 1)
  )
    return productId ? (
      <Navigate
        to={`/shop/${id}/${currentPage}/product/${productId}`}
        replace
      />
    ) : (
      <Navigate to={`/shop/${id}/${currentPage}`} replace />
    );
  else return <Outlet />;
};

export default PrefetchProducts;
