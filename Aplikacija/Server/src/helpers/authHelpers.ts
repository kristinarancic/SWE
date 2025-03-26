import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/validateEnv';
interface IWorkingHours {
  workingDays: {
    start: string;
    finish: string;
  };
  saturday: {
    start: string;
    finish: string;
  };
  sunday: {
    start: string;
    finish: string;
  };
}
export interface UserInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  suspended: boolean;
  residence?: {
    address: string;
    city: string;
    zip: number;
  };
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ShopInfo {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  suspended: boolean;
  description: string;
  workingHours?:
    | {
        workingDays?:
          | {
              start?: string | undefined;
              finish?: string | undefined;
            }
          | undefined;
        saturday?:
          | {
              start?: string | undefined;
              finish?: string | undefined;
            }
          | undefined;
        sunday?:
          | {
              start?: string | undefined;
              finish?: string | undefined;
            }
          | undefined;
      }
    | undefined;

  gdp?: number;
  registrationNumber?: number;
  instagram?: string;
  facebook?: string;
  residence?: {
    address: string;
    city: string;
    zip: number;
  };
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const generateAccessToken = (entityInfo: UserInfo | ShopInfo) => {
  return jwt.sign(
    {
      entityInfo: entityInfo,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15min' }
  );
};

export const generateRefreshToken = (entityInfo: UserInfo | ShopInfo) => {
  return jwt.sign(
    {
      entityInfo: entityInfo,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  // Test for photo size
  // Nece moci ovako
  // const tokenSizeInBytes = new TextEncoder().encode(refreshToken).length;
  // const user = jwt.decode(refreshToken) as jwt.JwtPayload;
  // console.log(new TextEncoder().encode(user.UserInfo.photo).length / 1024);
  // const tokenSizeInKB = tokenSizeInBytes / 1024;
  // console.log(`Refresh token size: ${tokenSizeInKB} KB`);
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};
export const setReturnUser = (foundUser: UserInfo) => {
  return {
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    email: foundUser.email,
    residence: foundUser.residence,
    phone: foundUser.phone,
    role: foundUser.role,
    id: foundUser.id,
    suspended: foundUser.suspended,
  };
};
export const setReturnShop = (foundShop: ShopInfo) => {
  return {
    id: foundShop.id,
    name: foundShop.name,
    email: foundShop.email,
    residence: foundShop.residence,
    phone: foundShop.phone,
    role: foundShop.role,
    suspended: foundShop.suspended,
    instagram: foundShop.instagram,
    facebook: foundShop.facebook,
    workingHours: foundShop.workingHours,
    description: foundShop.description,
  };
};
