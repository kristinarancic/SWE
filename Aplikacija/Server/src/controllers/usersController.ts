import { RequestHandler } from 'express';
import User from '../models/User';

// Get User
// Route GET /users/:id - Nije uradjeno
export const getUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select('-password -createdAt -updatedAt')
      .exec();
    if (!user) {
      return res.status(400).json({ message: `Korisnik ${id} ne postoji!` });
    }
    res.status(201).json(user);
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update User
// Route PATCH /users
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id, email, photo, firstName, lastName, phone, residence } =
      req.body;
    //  Confirm Data
    if (!id || !firstName || !lastName || !email)
      return res
        .status(400)
        .json({ message: 'Sve polja označena * su obavezna!' });
    const user = await User.findById(id).exec();
    if (!user)
      return res.status(400).json({ message: 'Korisnik nije pronađen!' });
    // Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id)
      return res
        .status(409)
        .json({ message: 'Korisnik sa ovom email adresom već postoji!' });
    // Updating user
    user.firstName = firstName;
    user.lastName = lastName;
    user.photo = photo;
    user.email = email;
    user.phone = phone;
    user.residence = residence;
    const updatedUser = await user.save();
    res.status(201).json({
      message: `Korisnik ${updatedUser.firstName} ${updatedUser.lastName} sa e-mail adresom: ${updatedUser.email} je uspešno ažurirao svoje podatke!`,
    });
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Greška na serveru!' });
  }
};

// Suspend User
// Route PATCH /users/suspend
export const suspendUser: RequestHandler = async (req, res) => {
  try {
    const { _id, userId } = req.body;
    const admin = await User.findById(_id).select('role').exec();
    if (!admin || admin.role != 'Admin')
      return res.status(403).json({
        message:
          'Niste Admin i nije Vam dozvoljeno suspendovanje drugih članova!',
      });
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { suspended: true },
      { new: true }
    ).select('email');
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Korisnik sa ovim ID-em nije pronađen!' });
    }
    res.status(200).json({
      message: `Korisnik sa email adresom ${user.email} uspešno suspendovan!`,
    });
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Unsuspend User
// Route PATCH /users/unsuspend
export const unsuspendUser: RequestHandler = async (req, res) => {
  try {
    const { _id, userId } = req.body;
    const admin = await User.findById(_id).select('role').exec();
    if (!admin || admin.role != 'Admin')
      return res.status(403).json({
        message:
          'Niste Admin i nije Vam dozvoljeno aktiviranje naloga drugih članova!',
      });
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { suspended: false },
      { new: true }
    ).select('email');
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Korisnik sa ovim ID-em nije pronađen!' });
    }
    res.status(200).json({
      message: `Nalog korisnika sa email adresom ${user.email} uspešno aktiviran!`,
    });
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
