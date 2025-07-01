import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Product } from "../models/product.js";
import bcrypt from "bcrypt";
import { Category } from "../models/category.js";
import { Payment } from "../models/payment.js";
import { Chat } from "../models/chatModel.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
const createUser = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  const checkForUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (checkForUser) {
    return res
      .status(400)
      .json({ message: "Try a different username or email" });
  }

  const user = await User.create({
    fullName,
    email,
    username,
    password,
    role: ["buyer"], //Important for authorization flow
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json({ message: "Something went wrong in user creation" });
  }

  return res
    .status(201)
    .json({ message: "Successfully created user", data: createdUser });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  


  const isTheirUser = await User.findOne({ email });
  if (!isTheirUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    isTheirUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Password incorrect" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    isTheirUser._id
  );

  isTheirUser.refreshToken = refreshToken;
  await isTheirUser.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true, // Cookie cannot be accessed via JS
    secure: false, // Set to `true` in production (HTTPS only)
    sameSite: "Lax", // "None" if using HTTPS + cross-site
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
    path: "/", // Available on all routes
    //domain: "localhost"
  };

  const loggedInUser = await User.findById(isTheirUser._id).select(
    "-password -refreshToken"
  );
  
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Successfully logged in",
      data: loggedInUser,
      accessToken,
      refreshToken,
    });
};

const uploadProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) categoryDoc = await Category.create({ name: category });

    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: category });
    }

    const fullUser = await User.findById(user._id);
    if (!fullUser.role.includes("seller") ) {
      fullUser.role.push("seller");
      await fullUser.save();
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      category: categoryDoc._id,
      postedBy: user._id,
      status: "pending",
    });

    return res.status(201).json({
      message: "Product uploaded and user promoted to seller (if not already).",
      data: newProduct,
    });
  } catch (error) {
    console.error("Product upload failed:", error);
    return res.status(500).json({
      message: "Server error during product upload",
      error: error.message,
    });
  }
};

const searchForProduct = async (req, res) => {
  try {
    const { category, title } = req.body;

    const categoryDocument = await Category.findOne({ name: category });
    if (!categoryDocument) {
      return res.status(404).json({ message: "No such category found" });
    }

    //Build the aggregation pipeline
    const pipeline = [
      {
        $match: {
          category: categoryDocument._id,
          ...(title && { title: { $regex: title, $options: "i" } }), // it finds all products with given category and title
        },
      },
      //attaches categoryDetails in all above filtered products which is whats the catoegry name  for that product.
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 1,
          title: 1,
          price: 1,
          image: 1,
          "categoryDetails.name": 1,
        },
      },
    ];

    const products = await Product.aggregate(pipeline);

    if (products.length === 0) {
      return res.status(404).json({
        message:
          "No products found in this category" +
          (title ? ` matching '${title}'` : ""),
      });
    }

    return res.status(200).json({
      message: "Products found successfully",
      data: products,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params; // product ID from URL
  const userId = req.user._id; // authenticated user ID from JWT
  const { title, price } = req.body;

  try {
    const user = await User.findById(userId); 
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //  Owner or seller can update
    const isOwner = product.postedBy.toString() === userId.toString();
    const isSeller = user.role.includes("seller");

    if (!isOwner && !isSeller) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update fields if provided
    if (title) product.title = title;
    if (price) product.price = price;

    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getMyPostedProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const productsPostedByUser = await Product.find({
      postedBy: userId,
    }).populate("category", "name"); // populate takes category parameter and find category doc for given id of product and returns obj conating name and (object id)_id as default.instaed of just object id.

    if (!productsPostedByUser || productsPostedByUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      count: productsPostedByUser.length,
      data: productsPostedByUser,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// for future scalability right now user automatically becomes seller when it tries to upload product
const becomeSeller = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.roles.includes("seller")) {
      return res.status(400).json({ message: "You are already a seller" });
    }

    user.role.push("seller");
    await user.save();

    return res.status(200).json({ message: "You are now a seller" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user._id;

    const purchases = await Payment.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          status: "paid",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "productDetails.categoryDetails",
        },
      },
      { $unwind: "$productDetails.categoryDetails" },
      {
        $project: {
          _id: 1,
          amount: 1,
          orderId: 1,
          paymentId: 1,
          product: {
            _id: "$productDetails._id",
            title: "$productDetails.title",
            price: "$productDetails.price",
            description: "$productDetails.description",
            status: "$productDetails.status",
            image: "$productDetails.image",
            category: "$productDetails.categoryDetails.name",
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "User purchases with category retrieved",
      data: purchases,
    });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return res.status(500).json({
      message: "Failed to fetch purchases",
      error: error.message,
    });
  }
};


const createChat = async (req, res) => {
  try {
    const { productId, buyerId, ownerId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({ productId, buyerId, ownerId });
    if (existingChat) {
      return res.status(200).json({ success: true, chat: existingChat });
    }

    // Create new chat
    const newChat = await Chat.create({ productId, buyerId, ownerId });
    return res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getSellerChats = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const chats = await Chat.find({ ownerId: sellerId })
      .populate("buyerId", "username email") // adds username amd email to buyserId .now it is like buyerId:{_id:--,uername:---,email:---}
      .populate("productId", "title"); // same as above

    const response = chats.map((chat) => ({
      _id: chat._id,
      roomId: `${chat.buyerId._id}_${chat.ownerId}_${chat.productId._id}`,
      buyer: chat.buyerId,
      product: chat.productId,
    }));

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("Error fetching seller chats:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {
  createUser,
  loginUser,
  uploadProduct,
  searchForProduct,
  updateProduct,
  getMyPostedProducts,
  becomeSeller,
  getUserPurchases,
  createChat,
  getSellerChats
};
