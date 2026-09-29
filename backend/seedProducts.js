const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Cloud Comfort Maternity Pillow",
    category: "Maternity Pillows",
    price: 4990,
    oldPrice: 5990,
    image: "/products/maternity-pillow-1.jpg",
    description:
      "A soft and supportive maternity pillow designed for comfortable rest during pregnancy.",
    rating: 5,
    reviews: 12,
    tag: "Best Seller",
    stock: 20,
    active: true,
  },

  {
    name: "Mum's Embrace Pregnancy Pillow",
    category: "Maternity Pillows",
    price: 5490,
    oldPrice: 6490,
    image: "/products/maternity-pillow-2.jpg",
    description:
      "Gentle full-body support designed to provide comfort for mothers during pregnancy.",
    rating: 5,
    reviews: 9,
    tag: "Popular",
    stock: 18,
    active: true,
  },

  {
    name: "Soft Nest Baby Pillow",
    category: "Baby Pillows",
    price: 2490,
    oldPrice: 2990,
    image: "/products/baby-pillow-1.jpg",
    description:
      "A soft baby pillow made for gentle comfort and cozy resting moments.",
    rating: 5,
    reviews: 15,
    tag: "Baby Care",
    stock: 25,
    active: true,
  },

  {
    name: "Little Cloud Baby Pillow",
    category: "Baby Pillows",
    price: 2190,
    oldPrice: 2690,
    image: "/products/baby-pillow-2.jpg",
    description:
      "A lightweight and soft pillow created for your little one's comfort.",
    rating: 5,
    reviews: 11,
    tag: "New",
    stock: 22,
    active: true,
  },

  {
    name: "Gentle Sleep Baby Pillow",
    category: "Baby Pillows",
    price: 2690,
    oldPrice: 3190,
    image: "/products/baby-pillow-3.jpg",
    description:
      "Soft everyday comfort for peaceful and cozy baby resting moments.",
    rating: 5,
    reviews: 8,
    tag: "Comfort",
    stock: 20,
    active: true,
  },

  {
    name: "Grand Comfort Pillow",
    category: "Elders Pillows",
    price: 3490,
    oldPrice: 3990,
    image: "/products/elder-pillow-1.jpg",
    description:
      "Comfort-focused support designed for relaxing and restful moments.",
    rating: 5,
    reviews: 7,
    tag: "Comfort",
    stock: 15,
    active: true,
  },

  {
    name: "Relax & Rest Support Pillow",
    category: "Elders Pillows",
    price: 3790,
    oldPrice: 4290,
    image: "/products/elder-pillow-2.jpg",
    description:
      "A supportive pillow designed to make everyday relaxation more comfortable.",
    rating: 5,
    reviews: 6,
    tag: "Support",
    stock: 15,
    active: true,
  },

  {
    name: "Heritage Comfort Pillow",
    category: "Elders Pillows",
    price: 3290,
    oldPrice: 3790,
    image: "/products/elder-pillow-3.jpg",
    description:
      "Classic comfort and gentle support for relaxing at home.",
    rating: 5,
    reviews: 5,
    tag: "Classic",
    stock: 12,
    active: true,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    // Remove existing products so they aren't duplicated
    await Product.deleteMany({});

    // Insert existing MAMTA products
    const insertedProducts = await Product.insertMany(products);

    console.log(
      `${insertedProducts.length} products inserted successfully.`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("SEED PRODUCTS ERROR:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();