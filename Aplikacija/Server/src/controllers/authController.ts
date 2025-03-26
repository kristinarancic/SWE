import { RequestHandler } from 'express';
import env from '../config/validateEnv';
import User from '../models/User';
import Shop from '../models/Shop';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
  setRefreshTokenCookie,
  hashPassword,
  setReturnUser,
  setReturnShop,
  UserInfo,
  ShopInfo,
} from '../helpers/authHelpers';

// Login
// POST /auth/login/user
export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Sva polja označena * je neophodno popuniti!' });
  }
  // Checking email first
  const foundUser = await User.findOne({ email })
    .select('-createdAt -updatedAt -photo')
    .exec();
  if (!foundUser) {
    return res.status(401).json({
      message:
        'Korisnik sa ovom e-mail adresom ne postoji. Molimo Vas registrujte novi nalog!',
    });
  }

  // Decrypting password and checking it
  const match = await comparePassword(password, foundUser.password);
  if (!match) return res.status(401).json({ message: 'Pogrešna lozinka!' });

  if (foundUser.suspended)
    return res.status(401).json({
      message:
        'Vaš nalog je suspendovan, proverite vaš email nalog za više informacija!',
    });

  // Returning only needed info
  const responseUser = setReturnUser(foundUser);

  // Creating jwt
  const accessToken = generateAccessToken(responseUser);
  const refreshToken = generateRefreshToken(responseUser);
  // Creating secure cookie with refresh token
  setRefreshTokenCookie(res, refreshToken);
  // Sending accessToken containing userInfo
  res.json({ accessToken });
};

// Login
// POST /auth/login/shop
export const loginShop: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Sva polja označena * je neophodno popuniti!' });
  }
  // Checking email first
  const foundShop = await Shop.findOne({ email })
    .select('-createdAt -updatedAt -photo')
    .exec();
  if (!foundShop) {
    return res.status(401).json({
      message:
        'Prodavnica sa ovom e-mail adresom ne postoji. Molimo Vas registrujte novi nalog!',
    });
  }

  // Decrypting password and checking it
  const match = await comparePassword(password, foundShop.password);
  if (!match) return res.status(401).json({ message: 'Pogrešna lozinka!' });

  if (foundShop.suspended)
    return res.status(401).json({
      message:
        'Vaš nalog je suspendovan, proverite vaš email nalog za više informacija!',
    });

  // Returning only needed info
  const responseShop = setReturnShop(foundShop);

  // Creating jwt
  const accessToken = generateAccessToken(responseShop);
  const refreshToken = generateRefreshToken(responseShop);

  // Creating secure cookie with refresh token
  setRefreshTokenCookie(res, refreshToken);
  // Sending accessToken containing userInfo
  res.json({ accessToken });
};

// Register
// POST /auth/register/user
export const registerUser: RequestHandler = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    residence,
    password,
    photo,
    confirmPassword,
  } = req.body;
  // Confirming data
  if (!firstName || !lastName || !email || !password || !confirmPassword)
    return res
      .status(400)
      .json({ message: 'Sva polja označena sa * je neophodno popuniti!' });
  // Check if passwords are identical
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ message: 'Vaša lozinka i potvrđena lozinka se ne poklapaju!' });
  // Check for duplicate
  const duplicate = await User.findOne({ email }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: 'Korisnik sa ovom e-mail adresom već postoji!' });
  }
  const hashedPassword = await hashPassword(password);
  const userObject = {
    firstName,
    lastName,
    email,
    phone,
    residence,
    password: hashedPassword,
    photo,
  };
  // Create and store new user
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({
      message: `Novi nalog ${firstName} ${lastName} čiji je e-mail: ${email} uspešno kreiran! Sada možete kupovati proizvode putem naše platforme. Srećna kupovina!`,
    });
  } else {
    res.status(400).json({ message: 'Nevalidni podaci poslati serveru!' });
  }
};

// Register
// POST /auth/register/shop
export const registerShop: RequestHandler = async (req, res) => {
  const {
    name,
    email,
    phone,
    residence,
    password,
    photo,
    confirmPassword,
    instagram,
    facebook,
    workingHours,
    description,
    gdp,
    registrationNumber,
  } = req.body;
  // Confirming data
  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !gdp ||
    !registrationNumber
  )
    return res
      .status(400)
      .json({ message: 'Sva polja označena sa * je neophodno popuniti!' });
  // Check if passwords are identical
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ message: 'Vaša lozinka i potvrđena lozinka se ne poklapaju!' });
  // Check for duplicate
  const duplicate = await User.findOne({ email }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: 'Prodavnica sa ovom e-mail adresom već postoji!' });
  }
  const hashedPassword = await hashPassword(password);
  const shopObject = {
    name,
    email,
    phone,
    residence,
    password: hashedPassword,
    photo,
    facebook,
    instagram,
    workingHours,
    description,
    gdp,
    registrationNumber,
  };
  // Create and store new shop
  const shop = await Shop.create(shopObject);
  if (shop) {
    res.status(201).json({
      message: `Nova prodavnica ${name} čija je e-mail: ${email} adresa uspešno kreirana! Sada možete prodavati proizvode putem naše platforme. Srećno poslovanje!`,
    });
  } else {
    res.status(400).json({ message: 'Nevalidni podaci poslati serveru!' });
  }
};

// Refreshes the token
// GET /auth/refresh
export const refresh: RequestHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized!' });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    env.REFRESH_TOKEN_SECRET,
    async (
      error: VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (error) return res.status(403).json({ message: 'Forbidden' });
      const role = (decoded as JwtPayload).entityInfo.role;
      let foundUser: UserInfo | ShopInfo | null = null;

      if (role === 'Buyer' || role === 'Admin') {
        foundUser = await User.findOne({
          email: (decoded as JwtPayload).entityInfo.email,
        });
      } else if (role === 'Shop') {
        foundUser = await Shop.findOne({
          email: (decoded as JwtPayload).entityInfo.email,
        });
      }

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      let returnUser: UserInfo | ShopInfo | null = null;
      if (foundUser.role === 'Shop') {
        returnUser = setReturnShop(foundUser as ShopInfo);
      } else {
        returnUser = setReturnUser(foundUser as UserInfo);
      }

      const accessToken = generateRefreshToken(returnUser);
      res.json({ accessToken });
    }
  );
};

// Logout
// POST /auth/logout
export const logout: RequestHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  res.json({ message: 'Cookie cleared!' });
};

// Get Profile Image
// POST /auth/photo
export const getProfileImage: RequestHandler = async (req, res) => {
  const { id, role } = req.body;
  if (!id || !role)
    return res
      .status(400)
      .json({ message: 'Nevalidni podaci poslati serveru!' });
  let foundEntity;
  if (role === 'Buyer' || role === 'Admin') {
    foundEntity = await User.findById({
      _id: id,
    })
      .select('photo -_id')
      .exec();
  } else if (role === 'Shop') {
    foundEntity = await Shop.findById({
      _id: id,
    })
      .select('photo -_id')
      .exec();
  }
  if (!foundEntity)
    return res
      .status(400)
      .json({ message: 'Korisnik sa datim podacima nije pronađen!' });
  res.json(foundEntity);
};
