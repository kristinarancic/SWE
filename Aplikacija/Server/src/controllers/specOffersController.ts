import { RequestHandler } from 'express';
import SpecOffers from '../models/SpecialOffer';
import Notification from '../models/Notification';
import Shop from '../models/Shop';
import User from '../models/User';

// Radi na serveru, nije u funkciji jer notifikacije nisu u funkciji!

// Get All Special Offers
// Route GET /specialOffers
export const getSpecialOffers: RequestHandler = async (req, res) => {
  try {
    const specOffers = await SpecOffers.find().lean().exec();
    if (!specOffers) {
      res.status(400).json({ message: 'No special offer found' });
    }
    res.status(200).json(specOffers);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server not found' });
  }
};

// Get Special Offer
// Route GET /specialOffers/:id
export const getSpecialOfferById: RequestHandler = async (req, res) => {
  try {
    const specOffer = await SpecOffers.findById(req.params.id);
    if (!specOffer) {
      return res.status(404).json({ message: 'Special offer not found' });
    }
    return res.status(200).json(specOffer);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get All Special Offers of One Shop
// Route GET /specialOffers/shop/:shopId
export const getSpecialOfferByShopId: RequestHandler = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const specOffer = await SpecOffers.find({ shop: shopId }).exec();
    if (!specOffer) {
      return res.status(404).json({ message: 'Special offer not found' });
    }
    return res.status(200).json(specOffer);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get All Special Offers of One User
// Route GET /specialOffers/user/:userId
export const getSpecialOfferByUserId: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const specOffer = await SpecOffers.find({ buyer: userId }).exec();
    if (!specOffer) {
      return res.status(404).json({ message: 'Special offer not found' });
    }
    return res.status(200).json(specOffer);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Create Special Offer
// Route POST /specialOffers
export const createSpecialOffer: RequestHandler = async (req, res) => {
  try {
    const { shop, buyer, description, price, paymentType } = req.body;
    const newSpec = await SpecOffers.create({
      shop,
      buyer,
      description,
      price,
      paymentType,
    });
    const shopName = await Shop.findById(newSpec.shop).select('name');
    if (!shopName) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const notification = new Notification({
      user: newSpec.buyer,
      sender: newSpec.shop,
      message: `Cvećara ${shopName.name} Vam je poslala sledeću specijalnu ponudu "${newSpec.description}" čija je cena ${newSpec.price}din`,
      type: 'User',
    });
    if (!notification) {
      return res
        .status(400)
        .json({ message: 'Notification could not be created' });
    }
    await notification.save();
    res.status(201).json({ success: true, newSpec });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Confirm Special Offer
// Route PATCH /specialOffers/confirm/:id
export const confirmSpecialOffer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const specOffer = await SpecOffers.findById(id);
    if (!specOffer) {
      return res.status(404).json({ message: 'Special offer not found' });
    }
    specOffer.confirmedAt = new Date();
    const confirmedOffer = await specOffer.save();

    const buyer = await User.findById(specOffer.buyer).select(
      'firstName lastName'
    );
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const notification = new Notification({
      shop: specOffer.shop,
      sender: specOffer.buyer,
      message: `Kupac ${buyer.firstName} ${buyer.lastName} je potvrdio/la sledeću specijalnu ponudu "${specOffer.description}" čija je cena ${specOffer.price}din`,
      type: 'Shop',
    });
    if (!notification) {
      return res
        .status(400)
        .json({ message: 'Notification could not be created' });
    }
    await notification.save();

    return res
      .status(200)
      .json({
        message: 'Special offer confirmed succcessfully',
        confirmedOffer,
      });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Update Special Offer
// Route PATCH /specialOffers/:id
export const updateSpecialOffer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const specOffer = await SpecOffers.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!specOffer) {
      return res.status(404).json({ message: 'Special offer not found' });
    }
    return res
      .status(200)
      .json({ message: 'Special offer updated succcessfully', specOffer });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Delete Special Offer
// Route DELETE /specialOffers/:id
export const deleteSpecialOffer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpec = await SpecOffers.findByIdAndDelete(id);
    if (!deletedSpec) {
      return res.status(404).json({ message: 'Special offer not found' });
    }
    return res
      .status(200)
      .json({ message: 'Special offer deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};
