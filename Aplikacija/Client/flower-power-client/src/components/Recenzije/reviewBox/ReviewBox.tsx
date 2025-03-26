import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './ReviewBox.css';

import userIcon from '../../../images/user-icon.jpg';
import shopIcon from '../../../images/shop-icon.jpg';

import { isShop } from '../../helpers/roleConditionals';

import { IReview, IUser, IShop } from '../../helpers/Interfaces';
import useAuth from '../../../services/Auth/AuthFeatures/useAuth';
import { Button } from 'style-components';
import { useReportReviewMutation } from '../../../services/Reviews/reviewsApiSlice';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../../../services/Feedback/feedbackSlice';
interface Props {
  review: IReview;
  role: string;
}

const ReviewBox: React.FC<Props> = ({ review, role }) => {
  const { id } = useParams();
  const { id: _id } = useAuth() as IShop | IUser;
  const isCurrentEntity = id === _id ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [reportReview, { isSuccess, isError }] = useReportReviewMutation();

  useEffect(() => {
    isSuccess &&
      dispatch(
        setFeedback({
          open: true,
          message:
            'Uspešno ste prijavili recenziju, očekujte povratnu informaciju admina uskoro!',
          time: 3000,
          severity: 'success',
        })
      );
    isError &&
      dispatch(
        setFeedback({
          open: true,
          message:
            'Prijava recenzije nije uspešna, probajte ponovo kasnije ili kontaktirajte nekog admina direktno!',
          time: 3000,
          severity: 'success',
        })
      );
  }, [isSuccess, isError, dispatch]);

  const handleReportReview = async () => {
    await reportReview(review.id);
    navigate(0);
  };

  const renderSubmitReviewButton = () => {
    return isShop(role) && !review.reported && isCurrentEntity ? (
      <Button className='reportReview-button' onClick={handleReportReview}>
        Prijavi recenziju kupca
      </Button>
    ) : role === 'User' && !review.reported && isCurrentEntity ? (
      <Button className='reportReview-button' onClick={handleReportReview}>
        Prijavi recenziju cvecare
      </Button>
    ) : null;
  };

  const renderStarIcons = (grade: number) => {
    const starIcons = [];
    const fullStarsCount = Math.floor(grade);
    const hasHalfStar = grade % 1 !== 0;

    for (let i = 0; i < fullStarsCount; i++) {
      starIcons.push(<StarIcon key={i} />);
    }

    if (hasHalfStar) {
      starIcons.push(<StarHalfIcon key='half' />);
    }

    const remainingStarsCount = 5 - Math.ceil(grade);
    for (let i = 0; i < remainingStarsCount; i++) {
      starIcons.push(<StarBorderIcon key={`empty-${i}`} />);
    }

    return starIcons;
  };

  return (
    <div className='review-box'>
      <div className='reviewerPhoto-stars-date'>
        <div key={review.id}>
          <img
            src={
              review.buyer.photo
                ? review.buyer.photo
                : review.createdBy === 'User'
                ? userIcon
                : review.shop.photo
                ? review.shop.photo
                : shopIcon
            }
            alt='Icon'
            style={{
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              marginRight: '10px',
            }}
            onClick={() => {
              if (review.createdBy === 'User') {
                navigate(`/userprofile/${review.buyer.id}`);
              } else if (review.createdBy === 'Shop') {
                navigate(`/shop/${review.shop.id}`);
              }
            }}
          />
        </div>

        <div className='star-date'>
          <div className='star-review'>{renderStarIcons(review.grade)}</div>
          <div className='date-review'>
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className='message-review'>
        <p>{review.message}</p>
      </div>
      <div className='reportReview-button-div'>
        {renderSubmitReviewButton()}
      </div>
    </div>
  );
};

export default ReviewBox;
