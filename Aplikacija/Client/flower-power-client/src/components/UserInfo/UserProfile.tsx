import { useEffect, useState, useRef } from 'react';
import { Avatar, Typography } from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';

import EditButton from './UserProfileButtons/EditButton';
import ChatButton from './UserProfileButtons/ChatButton';
import SuspendButton from './UserProfileButtons/SuspendButton';
import UnsuspendButton from './UserProfileButtons/UnsuspendButton';

import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../services/Auth/AuthFeatures/useAuth';
import { isAdmin, isShop, isBuyerOrGuest } from '../helpers/roleConditionals';
import { IUser } from '../helpers/Interfaces';

import { useGetUserMutation } from '../../services/Users/usersApiSlice';

import Loading from '../helpers/Loading';
import Reviews from '../Recenzije/Reviews';
import './UserProfile.css';
import Footer from '../Footer/Footer';

const UserProfile = () => {
  const nameColor = '#414141';
  const navigate = useNavigate();

  const { id } = useParams();
  const currentUser = useAuth() as IUser;
  const [user, setUser] = useState<IUser>({
    ...currentUser,
  });

  const isCurrentUser = id === currentUser.id ? true : false;

  // getUser Logic
  const effectRan = useRef(false);
  const [getUser, { isLoading, isError }] = useGetUserMutation();
  useEffect(() => {
    setUser(currentUser);
    // Forbidden for not logged in users and guests, else it gets user from database
    if ((!isCurrentUser && isBuyerOrGuest(currentUser.role)) || isError)
      navigate(-1);
    // eslint-disable-next-line
  }, [isCurrentUser, navigate, isError, currentUser.role]);

  useEffect(() => {
    if (effectRan.current === true && !isCurrentUser) {
      const fetchData = async () => {
        const res: any = await getUser(id);
        if (res.data) {
          setUser({ ...res.data, id: res.data._id });
        }
      };

      fetchData();
    } else {
      effectRan.current = true;
    }
  }, []);

  return (
    <>
      {isLoading && <Loading />}

      <div className='user-profile-container'>
        <div className='top-side-user'>
          {/* Left Side */}
          <div className='left-side'>
            <Avatar src={user.photo} className='user-avatar' />
          </div>

          {/*Middle Side*/}
          <div className='middle-side'>
            <div className='user-info'>
              <h1 color={nameColor} className='user-name'>
                {user.firstName} {user.lastName}
              </h1>

              <div className='user-buttons'>
                {isShop(currentUser.role) && <ChatButton />}
                {isAdmin(currentUser.role) &&
                  !isCurrentUser &&
                  (user.suspended ? (
                    <UnsuspendButton
                      _id={currentUser.id}
                      user={user}
                      setUser={setUser}
                    />
                  ) : (
                    <SuspendButton
                      _id={currentUser.id}
                      user={user}
                      setUser={setUser}
                    />
                  ))}
                {isCurrentUser && <EditButton />}
              </div>

              <h2 className='contact-heading'>Kontakt</h2>
              <div className='contact-info'>
                <div className='contact-item'>
                  <Typography className='contact-label'>Email:</Typography>
                  <Typography className='contact-value'>
                    {user.email}
                  </Typography>
                </div>
                <div className='contact-item'>
                  <Typography className='contact-label'>Telefon:</Typography>
                  <Typography className='contact-value'>
                    {user.phone}
                  </Typography>
                </div>
                <div className='contact-item'>
                  <LocationOnIcon className='location-icon' fontSize='medium' />
                  <Typography
                    variant='body2'
                    textAlign='center'
                    color='textSecondary'
                    className='location-info'
                  >
                    {user?.residence?.address} {user?.residence?.zip}{' '}
                    {user?.residence?.city}, Republika Srbija
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='user-reviews'>
          <div style={{ position: 'relative' }}>
            <Reviews role='User' />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UserProfile;
