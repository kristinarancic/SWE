import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentPhoto } from '../authSlice';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { IShop, IUser } from '../../../components/helpers/Interfaces';

interface DecodedToken {
  entityInfo: IShop | IUser;
}
const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const photo = useSelector(selectCurrentPhoto);

  if (token) {
    // All entity data except photo
    const decoded = jwtDecode<JwtPayload & DecodedToken>(token);
    const role = decoded.entityInfo.role;
    if (role) {
      let data: IShop | IUser | null = null;
      role === 'Shop'
        ? (data = { ...decoded.entityInfo })
        : role === 'Buyer' || role === 'Admin'
        ? (data = { ...decoded.entityInfo })
        : null;
      if (data) return { ...data, photo: photo };
      else return { role: 'Guest', photo: null };
    }
  }
  return { role: 'Guest', photo: null };
};

export default useAuth;
