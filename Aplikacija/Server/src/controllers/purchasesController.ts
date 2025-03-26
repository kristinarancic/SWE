import { RequestHandler } from 'express';
import Purchase from '../models/Purchase';
import Product from '../models/Product';
import { Types } from 'mongoose';
import User from '../models/User';
import Notification from '../models/Notification';
import Shop from '../models/Shop';

// Get Unconfirmed Purchase of One User (Cart)
// Route GET /purchases/cart
//ne znam da li treba, jer vec ima getPurchasebyId
export const getUncomfirmedPurchaseByUserId: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.query;
    const purchase = await Purchase.findOne({
      buyer: id,
      confirmedAt: null,
    })
      .populate('products.product products.quantity')
      .exec();
    if (!purchase) {
      return res.status(200).json({ message: 'No purchase found' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Create Purchase
// Route POST /purchase
export const createPurchase: RequestHandler = async (req, res) => {
  try {
    const { id, products } = req.body;
    const productsData = await Product.find({ _id: products[0].product.id });

    //checking if product is out of stock
    for (const product of productsData) {
      if (product.quantity < products[0].quantity) {
        return res
          .status(400)
          .json({ message: `Proizvod ${product.name} nema na stanju` });
      }
    }
    //calculating price of all products in this purchase
    const price = productsData[0].price;

    //getting shopId from products
    const shop = productsData.length > 0 ? productsData[0].shop : null;

    const newPurchase = await Purchase.create({
      shop,
      buyer: id,
      products: productsData.map((product, index) => ({
        product: product._id,
        quantity: products[index].quantity,
      })),
      price,
    });
    res.status(201).json({ success: true, purchase: newPurchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Add Product to Purchase
// If product is already in cart, you only increase its quantity
// If product isn't in cart, you add it with quantity 1
// Route PATCH /purchases/add
export const addProductsToPurchase: RequestHandler = async (req, res) => {
  try {
    const { id, productId } = req.body;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    //adding new product
    const productObjectId = new Types.ObjectId(productId);
    const existingProductIndex = purchase.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // The product already exists in the purchase, increase its quantity
      purchase.products[existingProductIndex].quantity += 1;
    } else {
      // The product doesn't exist in the purchase, add it with quantity 1
      purchase.products.push({ product: productObjectId, quantity: 1 });
    }
    //calculating price of all products in this purchase, including new added one
    const productsData = await Product.find({
      _id: { $in: purchase.products.map((p) => p.product) },
    });
    const price = productsData.reduce((total, product) => {
      const purchaseProduct = purchase.products.find(
        (p) => p.product.toString() === product._id.toString()
      );
      const purchaseQuantity = purchaseProduct ? purchaseProduct.quantity : 0;
      return total + product.price * purchaseQuantity;
    }, 0);
    purchase.price = price;
    //saving changes in database
    const updatedPurchase = await purchase.save();
    return res
      .status(200)
      .json({ message: 'Product added successfully', updatedPurchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Remove Product from Purchase
// If quantity of product is more than 1, you only decrease its quantity by 1
// If quantity of product is 1, you remove it from cart
// If product has quantity 1 and it's the only product in cart, purchase is deleted
// Route PATCH /purchases/decrease
export const removeProductsFromPurchase: RequestHandler = async (req, res) => {
  try {
    const { id, productId } = req.body;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    const productIndex = purchase.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Product not found in the purchase' });
    }

    // Removing the specified quantity of the product from the purchase
    const product = purchase.products[productIndex];

    if (product.quantity > 1) {
      // Decrease the quantity of the product by 1
      product.quantity -= 1;
    } else {
      // Remove the product from the purchase
      purchase.products.splice(productIndex, 1);
    }

    // Delete the whole purchase if it contains only the removed product with quantity 1
    if (purchase.products.length === 0) {
      await Purchase.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Purchase deleted successfully' });
    }

    // Calculate the updated price of the purchase
    const productsData = await Product.find({
      _id: { $in: purchase.products.map((p) => p.product) },
    });
    const price = productsData.reduce((total, product) => {
      const purchaseProduct = purchase.products.find(
        (p) => p.product.toString() === product._id.toString()
      );
      const purchaseQuantity = purchaseProduct ? purchaseProduct.quantity : 0;
      return total + product.price * purchaseQuantity;
    }, 0);
    purchase.price = price;

    // Saving changes in the database
    const updatedPurchase = await purchase.save();
    return res
      .status(200)
      .json({ message: 'Product removed successfully', updatedPurchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Remove Product from Purchase
// If quantity of product is 1 or more than 1, you remove it from cart
// If product has quantity 1 and it's the only product in cart, purchase is deleted
// Route PATCH /purchases/remove
export const removeProductsAllFromPurchase: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id, productId } = req.body;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    const productIndex = purchase.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Product not found in the purchase' });
    }

    // Removing product from the purchase
    purchase.products.splice(productIndex, 1);

    // Delete the whole purchase if it contains only the removed product with quantity 1
    if (purchase.products.length === 0) {
      await Purchase.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Purchase deleted successfully' });
    }

    // Calculate the updated price of the purchase
    const productsData = await Product.find({
      _id: { $in: purchase.products.map((p) => p.product) },
    });
    const price = productsData.reduce((total, product) => {
      const purchaseProduct = purchase.products.find(
        (p) => p.product.toString() === product._id.toString()
      );
      const purchaseQuantity = purchaseProduct ? purchaseProduct.quantity : 0;
      return total + product.price * purchaseQuantity;
    }, 0);
    purchase.price = price;

    // Saving changes in the database
    const updatedPurchase = await purchase.save();
    return res
      .status(200)
      .json({ message: 'Product removed successfully', updatedPurchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Confirm Purchase
// Route PATCH /purchases/confirm/:id
export const confirmPurchase: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    const productsData = await Product.find({
      _id: { $in: purchase.products.map((p) => p.product) },
    });

    // Checking if product is out of stock
    for (const purchaseProduct of purchase.products) {
      const product = productsData.find(
        (p) => p._id.toString() === purchaseProduct.product.toString()
      );
      if (!product || product.quantity < purchaseProduct.quantity) {
        return res.status(400).json({ message: `Product is out of stock` });
      }
    }

    purchase.confirmedAt = new Date();

    // Decreasing quantity of purchased products
    for (const purchaseProduct of purchase.products) {
      const product = productsData.find(
        (p) => p._id.toString() === purchaseProduct.product.toString()
      );
      if (product) {
        product.quantity -= purchaseProduct.quantity;
        await Product.findByIdAndUpdate(product._id, {
          quantity: product.quantity,
        });
      }
    }
    const user = await User.findById(purchase.buyer).select(
      'firstName lastName'
    );
    if (!user) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    const shop = await Shop.findById(purchase.shop).select('name');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const notification = new Notification({
      shop: purchase.shop,
      sender: purchase.buyer,
      message: `Kupac ${user.firstName} ${user.lastName} je potvrdio/la kupovinu u Vašoj cvećari`,
      type: 'Shop',
    });
    const notification2 = new Notification({
      user: purchase.buyer,
      sender: purchase.shop,
      message: `Potvrdili ste kupovinu u cvećari ${shop.name}`,
      type: 'Buyer',
    });
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

    const updatedPurchase = await purchase.save();
    return res
      .status(200)
      .json({ message: 'Purchase confirmed successfully', updatedPurchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Trenutno se ne koriste ove funkcije!

// Update Purchase
// Route PATCH /purchases/:id
export const updatePurchase: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByIdAndUpdate(id, req.body);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    return res
      .status(200)
      .json({ message: 'Purchase updated successfully', purchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Delete Purchase
// Route DELETE /purchases/:id
export const deletePurchase: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPurchase = await Purchase.findByIdAndDelete(id);
    if (!deletedPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    return res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get All Purchases
// Route GET /purchases
export const getPurchases: RequestHandler = async (req, res) => {
  try {
    const purchases = await Purchase.find().lean().exec();
    if (!purchases) {
      res.status(400).json({ message: 'No purchase found' });
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Purchase
// Route GET /purchases/:id
export const getPurchaseById: RequestHandler = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    return res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get All Past (Confirmed) Purchases of One User
// Route GET /purchases/past/:userId
export const getPurchasesByUserId: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const purchases = await Purchase.find({
      buyer: userId,
      confirmedAt: { $ne: null },
    }).exec();
    if (!purchases) {
      return res.status(404).json({ message: 'No purchase found' });
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get All Products of One Purchase
// Route GET /purchases/onepurchase/:id
export const getAllProductsOnePurchase: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const purchase = await Purchase.findById(id); //.select('products');
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    const productsPurchase = purchase.products.map((p) => p.product);
    return res.status(200).json(productsPurchase);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Add Product to Purchase
// If product is already in cart, you change its quantity for new forwarded quantity
// If product isn't in cart, you add with forwarded quantity
// Route PATCH /purchases/add/:id/:productId/:quantity
export const addProductsToPurchaseQuantity: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id, productId, quantity } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    //adding new product
    const productObjectId = new Types.ObjectId(productId);
    const existingProductIndex = purchase.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // The product already exists in the purchase, increase its quantity
      purchase.products[existingProductIndex].quantity = parseInt(quantity);
    } else {
      // The product doesn't exist in the purchase, add it with quantity
      purchase.products.push({
        product: productObjectId,
        quantity: parseInt(quantity),
      });
    }
    //calculating price of all products in this purchase, including new added one
    const productsData = await Product.find({
      _id: { $in: purchase.products.map((p) => p.product) },
    });
    const price = productsData.reduce((total, product) => {
      const purchaseProduct = purchase.products.find(
        (p) => p.product.toString() === product._id.toString()
      );
      const purchaseQuantity = purchaseProduct ? purchaseProduct.quantity : 0;
      return total + product.price * purchaseQuantity;
    }, 0);
    purchase.price = price;
    //saving changes in database
    const updatedPurchase = await purchase.save();
    return res
      .status(200)
      .json({ message: 'Product added successfully', updatedPurchase });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};
