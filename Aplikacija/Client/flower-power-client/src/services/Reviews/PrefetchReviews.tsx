import { useEffect } from 'react';
import { store } from '../store';
import { reviewsApiSlice } from './reviewsApiSlice';
import { Outlet, useParams } from 'react-router-dom';

type Props = {
  role: string;
};
const PrefetchReviews = ({ role }: Props) => {
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      const reviews = store.dispatch(
        reviewsApiSlice.endpoints.getReviews.initiate({ id, role })
      );
      return () => {
        reviews.unsubscribe();
      };
    }
  }, [id, role]);
  return <Outlet />;
};

export default PrefetchReviews;
