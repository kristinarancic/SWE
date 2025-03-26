import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './ReviewSlider.css';

import ReviewBox from '../reviewBox/ReviewBox';

import { IReview } from '../../helpers/Interfaces';
interface Props {
  reviews: IReview[];
  role: string;
}

const ReviewSlider: React.FC<Props> = ({ reviews, role }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className='slider-recenzije'>
      <Carousel className='carousel-recenzije' responsive={responsive}>
        {reviews.map((review, index) => (
          <ReviewBox review={review} role={role} key={index} />
        ))}
      </Carousel>
    </div>
  );
};

export default ReviewSlider;
