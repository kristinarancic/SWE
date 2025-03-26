import { RequestHandler } from 'express';
import Product from '../models/Product';
import fs from 'fs';
import csv from 'csv-parse';

// Get Paginated Products
// Route GET /products/paginated
export const getProductsWithPagination: RequestHandler = async (req, res) => {
  const { page, id } = req.query;
  try {
    // Number of products on a page
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    // Returns number of products in database
    const total = await Product.countDocuments({ shop: id });
    const products = await Product.find({ shop: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .select('-password -createdAt -updatedAt')
      .lean()
      .exec();
    if (products.length === 0) {
      return res
        .status(400)
        .json({ message: 'Nije pronadjen ni jedan proizvod!' });
    }
    res.status(200).json({
      data: products,
      currentPage: page,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Update Product
// Route PATCH /products
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const product = await Product.findByIdAndUpdate(data.id, data, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Proizvod nije pronađen!' });
    }

    return res
      .status(200)
      .json({ message: 'Proizvod uspešno ažuriran', product });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Four Photos of Random Products of One Shop
// Route GET /products/fourRandom/:shopId
export const getFourRandomProductsPhotos: RequestHandler = async (req, res) => {
  const { shopId } = req.params;
  try {
    const products = await Product.find({ shop: shopId }).select('photo -_id');
    const randomProducts = [];

    while (randomProducts.length < 4 && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      randomProducts.push(products[randomIndex].photo);
      products.splice(randomIndex, 1);
    }
    res.status(200).json(randomProducts);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Update Products from One Shop from CSV
// Route PATCH /products/csv
export const updateProductsFromCSV: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body;
    const shopId = id;
    const file = req.file;
    const filePath = file?.path;

    const parser = csv.parse({
      columns: true,
      skip_empty_lines: true,
    });
    let readStream = null;
    if (filePath) readStream = fs.createReadStream(filePath).pipe(parser);
    else
      return res.status(400).json({
        message:
          'Greška prilikom otvaranja csv fajla! Molimo Vas pratite uputsva!',
      });

    const updatedProducts: any[] = [];

    readStream.on('data', async (row) => {
      const existingProduct = await Product.findOne({
        name: row.name,
        shop: shopId,
      });

      if (existingProduct) {
        console.log(existingProduct);
        existingProduct.price = row.price;
        existingProduct.type = row.type;
        existingProduct.photo = row.photo;
        existingProduct.description = row.description;
        existingProduct.quantity = row.quantity;
        await existingProduct.save();
        updatedProducts.push(existingProduct);
      } else {
        const newProduct = new Product({
          name: row.name,
          price: row.price,
          type: row.type,
          photo: row.photo,
          description: row.description,
          quantity: row.quantity,
          shop: shopId,
        });
        console.log('New', newProduct);
        await newProduct.save();
        updatedProducts.push(newProduct);
      }
    });

    readStream.on('end', () => {
      res
        .status(200)
        .json({ message: 'Asortiman proizvoda uspešno ažuriran!' });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Funkcije koje se trenutno ne koriste!

// Get All Products
// Route GET /products
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const products = await Product.find().lean().exec();
    if (!products) {
      res.status(400).json({ message: 'No review found' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Product
// Route GET /products/:id
export const getProductById: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); //.populate('shop', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Create Product
// Route POST /products
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, price, type, photo, description, quantity, shop } = req.body;
    const newProduct = await Product.create({
      name,
      price,
      type,
      photo,
      description,
      quantity,
      shop,
    });
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Delete Product
// Route DELETE /products/:id
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Create New Products from One Shop from CSV
// Route POST /products/csv/:shopId
export const importProductsFromCSV: RequestHandler = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const filePath = './products.csv';

    const parser = csv.parse({
      columns: true,
      skip_empty_lines: true,
    });

    const readStream = fs.createReadStream(filePath).pipe(parser);

    const products: any[] = [];

    readStream.on('data', async (row) => {
      const product = new Product({
        name: row.name,
        price: row.price,
        type: row.type,
        // photo: row.photo,
        description: row.description,
        quantity: row.quantity,
        shop: shopId,
      });
      await product.save();
      products.push(product);
    });

    readStream.on('end', () => {
      res.status(200).json({ message: 'Products updated succesfully' });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};

// Get Filtered Products
// Route GET /products/filter
export const filterProducts: RequestHandler = async (req, res) => {
  const { page, parameter, value, id } = req.query;
  try {
    // Number of products on a page
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    let products;
    let total = 0;
    if (parameter === 'type') {
      products = await Product.find({ shop: id, type: value })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex)
        .select('-password -createdAt -updatedAt')
        .lean()
        .exec();
      total = await Product.countDocuments({ shop: id, type: value });
    } else if (parameter === 'name') {
      products = await Product.find({ shop: id, name: value })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex)
        .select('-password -createdAt -updatedAt')
        .lean()
        .exec();
      total = await Product.countDocuments({ shop: id, name: value });
    }
    if (!products) {
      res.status(400).json({ message: 'Nijedan proizvod nije pronađen' });
    }
    res.status(200).json({
      data: products,
      currentPage: page,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
};
