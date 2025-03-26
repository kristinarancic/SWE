import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useRefreshMutation } from '../authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../authSlice';

import NavBar from '../../../components/NavBar/NavBar';
import useAuth from './useAuth';

import Login from '../../../components/UserAuth/LogIn/Login';
import Register from '../../../components/UserAuth/Register/Register';

import { useGetProfileImageMutation } from '../authApiSlice';
import { IShop, IUser } from '../../../components/helpers/Interfaces';
import Loading from '../../../components/helpers/Loading';
import Feedback from '../../../components/helpers/Feedback';

const PersistUserAuth = () => {
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  const { role, id } = useAuth() as IShop | IUser;

  const [getProfileImage] = useGetProfileImageMutation();

  useEffect(() => {
    // Because of React Strict mode it is running twice
    if (effectRan.current === true) {
      const verifyRefreshToken = async () => {
        try {
          await refresh(null);
          // This is set because of delay
          setTrueSuccess(true);
        } catch (error) {
          console.error(error);
        }
      };
      if (!token) verifyRefreshToken();
    }

    effectRan.current = true;

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getPhoto = async () => {
      await getProfileImage({ id, role });
    };
    if (token) {
      getPhoto();
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <>
      <Login />
      <Register />
      <Feedback />
      {(isSuccess && trueSuccess) || isError ? (
        <>
          <NavBar role={role} />
          <Outlet />
        </>
      ) : isLoading && isUninitialized ? (
        <Loading />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default PersistUserAuth;
