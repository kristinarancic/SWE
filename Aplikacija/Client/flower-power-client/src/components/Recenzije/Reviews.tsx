import React from 'react';
import ReviewSlider from './reviewSlider/ReviewSlider';
import './Reviews.css';
import { useSelector } from 'react-redux';
import { selectAllReviews } from '../../services/Reviews/reviewsApiSlice';
import { RootState } from '../../services/store';
import { useParams } from 'react-router-dom';
interface ReviewsProps {
  role: string;
}

const Reviews: React.FC<ReviewsProps> = ({ role }) => {
  const { id } = useParams();
  const reviews = useSelector((state: RootState) =>
    selectAllReviews(state, id as string, role)
  );

  return (
    <section id='Recenzije'>
      <div className='recenzije-sekcija'>
        <h1 className='naslov-recenzije'>Recenzije</h1>
        <div className='review-slider'>
          <ReviewSlider reviews={reviews} role={role} />
        </div>
      </div>
    </section>
  );
};

export default Reviews;
