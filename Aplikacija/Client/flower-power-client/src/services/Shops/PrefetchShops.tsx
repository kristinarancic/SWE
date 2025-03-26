import { useEffect } from 'react';
import { store } from '../store';
import { shopsApiSlice, selectNumberOfPages } from './shopsApiSlice';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
const PrefetchShops = () => {
  const { page } = useParams();
  let currentPage: number;
  page === undefined ? (currentPage = 1) : (currentPage = Number(page));
  const numberOfPages = useSelector((state: RootState) =>
    selectNumberOfPages(state, currentPage)
  );

  useEffect(() => {
    const shops = store.dispatch(
      shopsApiSlice.endpoints.getShops.initiate(Number(currentPage))
    );
    return () => {
      shops.unsubscribe();
    };
    // eslint-disable-next-line
  }, [currentPage]);
  // Restricts to number of pages
  if (page !== undefined && (currentPage > numberOfPages || currentPage < 0))
    return <Navigate to='1' replace />;
  else return <Outlet />;
};

export default PrefetchShops;
