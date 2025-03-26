import { RequestHandler } from 'express';
import Review from '../models/Review';
import Notification from '../models/Notification';
import User from '../models/User';
import Shop from '../models/Shop';

// Get All Reviews
// Route GET /reviews/
export const getReviews: RequestHandler = async (req, res) => {
  const { id: _id, role } = req.query;
  try {
    let reviews;
    if (role === 'Shop') {
      reviews = await Review.find({ shop: _id, createdBy: 'User' })
        .populate('buyer')
        .exec();
      reviews = reviews.map((review: any) => {
        const { _id, ...rest } = review.buyer.toObject();
        const modifiedBuyer = {
          id: _id,
          ...rest,
        };
        return {
          ...review._doc,
          buyer: modifiedBuyer,
        };
      });
    } else if (role === 'User') {
      reviews = await Review.find({ buyer: _id, createdBy: 'Shop' })
        .populate('shop')
        .exec();
      reviews = reviews.map((review: any) => {
        const { _id, ...rest } = review.shop.toObject();
        const modifiedShop = {
          id: _id,
          ...rest,
        };
        return {
          ...review._doc,
          shop: modifiedShop,
        };
      });
    }
    if (!reviews) {
      res.status(400).json({ message: 'No review found' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Review
// Route GET /reviews/:id
export const getReviewById: RequestHandler = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.json({ review });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Update Review
// Route PATCH /reviews/report/:id
export const reportReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { reported: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const adminId = await User.findOne({ role: 'Admin' }).select('_id');
    if (!adminId) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const shop = await Shop.findById(review.shop).select('name');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const buyer = await User.findById(review.buyer).select(
      'firstName lastName'
    );
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    let notification;
    let notification2;
    //cvecara prijavljuje recenziju nekog kupca, kupac se suspenduje
    if (review.createdBy === 'User') {
      notification = new Notification({
        user: adminId,
        sender: review.shop,
        message: `Cvećara ${shop.name} je prijavila recenziju "${review.message}" kupca ${buyer.firstName} ${buyer.lastName}`,
        type: 'Admin',
      });
      notification2 = new Notification({
        user: review.buyer,
        sender: review.shop,
        message: `Cvećara ${shop.name} je prijavila vašu recenziju "${review.message}"`,
        type: 'Buyer',
      });
    }
    //kupac prijavljuje recenziju cvecare, cvecara se suspenduje
    if (review.createdBy === 'Shop') {
      notification = new Notification({
        user: adminId,
        sender: review.buyer,
        message: `Kupac ${buyer.firstName} ${buyer.lastName} je prijavio/la recenziju "${review.message}" cvećare ${shop.name}`,
        type: 'Admin',
      });
      notification2 = new Notification({
        shop: review.shop,
        sender: review.buyer,
        message: `Kupac ${buyer.firstName} ${buyer.lastName} je prijavio/la vašu recenziju "${review.message}"`,
        type: 'Shop',
      });
    }
    if (!notification) {
      return res
        .status(400)
        .json({ message: 'Notification could not be created' });
    }
    if (!notification2) {
      return res
        .status(400)
        .json({ message: 'Notification could not be created' });
    }
    await notification.save();
    await notification2.save();

    return res
      .status(200)
      .json({ message: 'Review reported successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Trenutno se ne koriste!

// Create Review
// Route POST /reviews
export const createReview: RequestHandler = async (req, res) => {
  try {
    const { shop, buyer, createdBy, message, grade } = req.body;
    const newReview = await Review.create({
      shop,
      buyer,
      createdBy,
      message,
      grade,
    });
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Delete Review
// Route DELETE /reviews/:id
export const deleteReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Update Review
// Route PATCH /reviews/:id
export const updateReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res
      .status(200)
      .json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};
