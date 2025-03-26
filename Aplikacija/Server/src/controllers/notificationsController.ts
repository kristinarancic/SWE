import { RequestHandler } from 'express';
import Notification from '../models/Notification';
import User from '../models/User';

// Testirano i radi serverski, ali nije uradjeno klijentski.

// Get All Notifications
// Route GET /notifications
export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const shops = await Notification.find().lean().exec();
    if (!shops) {
      res.status(400).json({ message: 'No notification found' });
    }
    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Unread Notifications for Specific User/Admin/Shop
// Route GET /notifications/unread
export const getNotificationsUnread: RequestHandler = async (req, res) => {
  const { id: _id, type } = req.query;
  try {
    let notifications;
    if (type === 'Shop') {
      notifications = await Notification.find({ shop: _id, read: false })
        .populate('user')
        .exec();
    } else if (type === 'Buyer') {
      notifications = await Notification.find({ user: _id, read: false })
        .populate('shop')
        .exec();
    } else if (type === 'Admin') {
      const user = await User.findById(_id);
      if (!user) {
        res.status(400).json({ message: 'No user found' });
      }
      notifications = await Notification.find({ user: _id, read: false })
        .populate(user ? 'user' : 'shop')
        .exec();
    }
    if (!notifications) {
      res.status(400).json({ message: 'No notification found' });
    }
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Read Notifications for Specific User/Admin/Shop
// Route GET /notifications/all
export const getNotificationsAll: RequestHandler = async (req, res) => {
  const { id: _id, type } = req.query;
  try {
    let notifications;
    if (type === 'Shop') {
      notifications = await Notification.find({ shop: _id })
        .populate('user')
        .exec();
    } else if (type === 'Buyer') {
      notifications = await Notification.find({ user: _id })
        .populate('shop')
        .exec();
    } else if (type === 'Admin') {
      const user = await User.findById(_id);
      if (!user) {
        res.status(400).json({ message: 'No user found' });
      }
      notifications = await Notification.find({ user: _id })
        .populate(user ? 'user' : 'shop')
        .exec();
    }
    if (!notifications) {
      res.status(400).json({ message: 'No notification found' });
    }
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};
