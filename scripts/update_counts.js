const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../src/models/Product');

// Load env
dotenv.config();

const updateCounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const products = await Product.find();
    
    for (let product of products) {
      product.sold_count = Math.floor(Math.random() * 500) + 10;
      product.view_count = product.sold_count + Math.floor(Math.random() * 2000) + 100;
      await product.save();
    }
    
    console.log('✅ Successfully updated sold_count and view_count for all products!');
    process.exit();
  } catch (error) {
    console.error('❌ Error updating counts:', error);
    process.exit(1);
  }
};

updateCounts();
