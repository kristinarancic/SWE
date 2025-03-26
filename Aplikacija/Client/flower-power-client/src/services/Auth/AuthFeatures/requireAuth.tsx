import useAuth from './useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { isGuest } from '../../../components/helpers/roleConditionals';
const RequireAuth = () => {
  const { role } = useAuth();
  return isGuest(role) ? <Navigate to='/' replace /> : <Outlet />;
};

export default RequireAuth;
