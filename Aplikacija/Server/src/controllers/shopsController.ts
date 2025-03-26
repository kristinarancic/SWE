import { RequestHandler } from 'express';
import Shop from '../models/Shop';
import Product from '../models/Product';
import User from '../models/User';

// Get Paginated Shops
// Route GET /shops/paginated
export const getShopsWithPagination: RequestHandler = async (req, res) => {
  const { page } = req.query;
  try {
    // Number of shops on a page
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    // Returns number of shops in database
    const total = await Shop.countDocuments({});
    const shops = await Shop.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .select('-password -createdAt -updatedAt')
      .lean()
      .exec();
    if (shops.length === 0) {
      return res.status(400).json({ message: 'No shop found' });
    }
    res.status(200).json({
      data: shops,
      currentPage: page,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Update Shop
// Route PATCH /shops
export const updateShop: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const shop = await Shop.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    return res
      .status(200)
      .json({ message: 'Uspešno ste ažurirali podatke o vašoj prodavnici!' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Shop Description
// Route PATCH /shops/description
export const updateShopDescription: RequestHandler = async (req, res) => {
  const { id, description } = req.body;
  try {
    const shop = await Shop.findByIdAndUpdate(id, { description: description });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.status(200).json(shop.description);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Suspend Shop
// Route PATCH /shops/suspend
export const suspendShop: RequestHandler = async (req, res) => {
  try {
    const { _id, shopId } = req.body;
    const admin = await User.findById(_id).select('role').exec();
    if (!admin || admin.role != 'Admin')
      return res.status(403).json({
        message: 'Niste Admin i nije Vam dozvoljeno suspendovanje cvećara!',
      });
    const shop = await Shop.findByIdAndUpdate(
      { _id: shopId },
      { suspended: true },
      { new: true }
    ).select('email');
    if (!shop) {
      return res
        .status(400)
        .json({ message: 'Cvećara sa ovim ID-em nije pronađena!' });
    }
    res.status(200).json({
      message: `Cvećara sa email adresom ${shop.email} uspešno suspendovana!`,
    });
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Unsuspend User
// Route PATCH /users/unsuspend
export const unsuspendShop: RequestHandler = async (req, res) => {
  try {
    const { _id, shopId } = req.body;
    const admin = await User.findById(_id).select('role').exec();
    if (!admin || admin.role != 'Admin')
      return res.status(403).json({
        message: 'Niste Admin i nije Vam dozvoljeno aktiviranje cvećara!',
      });
    const shop = await Shop.findByIdAndUpdate(
      { _id: shopId },
      { suspended: false },
      { new: true }
    ).select('email');
    if (!shop) {
      return res
        .status(400)
        .json({ message: 'Cvećara sa ovim ID-em nije pronađena!' });
    }
    res.status(200).json({
      message: `Cvećara sa email adresom ${shop.email} uspešno aktivirana!`,
    });
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Funkcije koje se trenutno ne koriste!

// Get Filtered Shops
// Route GET /shops/filter
// paginated
// Za sada parametri mogu biti city, name(ime cvecare ili ime proizvoda) i type(proizvoda)
export const filterShops: RequestHandler = async (req, res) => {
  const { page, parameter, value } = req.query;
  try {
    // Number of shops on a page
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    let shops;
    let total = 0;
    if (parameter === 'city') {
      shops = await Shop.find({ 'residence.city': value })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex)
        .select('-password -createdAt -updatedAt')
        .lean()
        .exec();
      total = await Shop.countDocuments({ 'residence.city': value });
    } else if (parameter === 'name') {
      const shopNameRegex = new RegExp(value as string, 'i');
      const productQuery = { name: shopNameRegex };

      const products = await Product.find(productQuery).select('shop');
      const shopIds = products.map((product) => product.shop);

      shops = await Shop.find({
        $or: [{ name: shopNameRegex }, { _id: { $in: shopIds } }],
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex)
        .select('-password -createdAt -updatedAt')
        .lean()
        .exec();

      total = await Shop.countDocuments({
        $or: [{ name: shopNameRegex }, { _id: { $in: shopIds } }],
      });
    } else if (parameter === 'type') {
      const productTypeRegex = new RegExp(value as string, 'i');
      const productQuery = { type: productTypeRegex };

      const products = await Product.find(productQuery).select('shop');
      const shopIds = products.map((product) => product.shop);

      shops = await Shop.find({ _id: { $in: shopIds } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex)
        .select('-password -createdAt -updatedAt')
        .lean()
        .exec();

      total = await Shop.countDocuments({ _id: { $in: shopIds } });
    }
    if (!shops) {
      res.status(400).json({ message: 'No shop found' });
    }
    res.status(200).json({
      data: shops,
      currentPage: page,
      numberOfPages: Math.ceil(total / limit),
    });
    // res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Shop
// Route GET /shops/:id
export const getShopById: RequestHandler = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).select('-password');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Delete Shop
// Route DELETE /shops/:id
// Also deleting all products from deleted shop
export const deleteShop: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShop = await Shop.findByIdAndDelete(id);
    if (!deletedShop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const products = await Product.find({ shop: id }).select('_id');
    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }
    if (products.length > 0) {
      for (const product of products) {
        await Product.findByIdAndDelete(product._id);
        return res.status(200); //.json({ message: 'Products of deleted shop deleted successfully' });
      }
    }
    return res.status(200).json({ message: 'Shop deleted successesfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};
