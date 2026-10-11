import mongoose from "mongoose";
import Product from "../models/Product.js";

const validateProductInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      errors.push("Product name is required");
    }
  }

  if (!isUpdate || data.sku !== undefined) {
    if (typeof data.sku !== "string" || !data.sku.trim()) {
      errors.push("SKU is required");
    }
  }

  if (!isUpdate || data.category !== undefined) {
    if (typeof data.category !== "string" || !data.category.trim()) {
      errors.push("Category is required");
    }
  }

  if (!isUpdate || data.price !== undefined) {
    if (
      data.price === "" ||
      data.price === null ||
      data.price === undefined ||
      !Number.isFinite(Number(data.price)) ||
      Number(data.price) < 0
    ) {
      errors.push("Price must be a non-negative number");
    }
  }

  if (data.quantity !== undefined) {
    if (
      data.quantity === "" ||
      !Number.isInteger(Number(data.quantity)) ||
      Number(data.quantity) < 0
    ) {
      errors.push("Quantity must be a non-negative whole number");
    }
  }

  if (data.lowStockThreshold !== undefined) {
    if (
      data.lowStockThreshold === "" ||
      !Number.isInteger(Number(data.lowStockThreshold)) ||
      Number(data.lowStockThreshold) < 0
    ) {
      errors.push("Low-stock threshold must be a non-negative whole number");
    }
  }

  if (
    data.description !== undefined &&
    typeof data.description !== "string"
  ) {
    errors.push("Description must be a string");
  }

  return errors;
};

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, stockStatus, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(limit, 10) || 10)
    );

    const filter = { owner: req.user._id };

    if (typeof search === "string" && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: regex },
        { sku: regex },
        { category: regex },
      ];
    }

    if (typeof category === "string" && category.trim()) {
      filter.category = category.trim();
    }

    if (stockStatus === "low") {
      filter.$expr = {
        $lte: ["$quantity", "$lowStockThreshold"],
      };
    } else if (stockStatus === "out") {
      filter.quantity = 0;
    } else if (stockStatus === "in") {
      filter.quantity = { $gt: 0 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const errors = validateProductInput(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    const {
      name,
      sku,
      category,
      description = "",
      price,
      quantity = 0,
      lowStockThreshold = 5,
    } = req.body;

    const normalizedSku = sku.trim().toUpperCase();

    const existingProduct = await Product.findOne({
      owner: req.user._id,
      sku: normalizedSku,
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists",
      });
    }

    const product = await Product.create({
      owner: req.user._id,
      name: name.trim(),
      sku: normalizedSku,
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold),
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const allowedFields = [
      "name",
      "sku",
      "category",
      "description",
      "price",
      "lowStockThreshold",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const errors = validateProductInput(updates, true);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    if (updates.name !== undefined) updates.name = updates.name.trim();
    if (updates.category !== undefined) {
      updates.category = updates.category.trim();
    }
    if (updates.sku !== undefined) {
      updates.sku = updates.sku.trim().toUpperCase();
    }
    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.lowStockThreshold !== undefined) {
      updates.lowStockThreshold = Number(updates.lowStockThreshold);
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updates },
     {
  returnDocument: "after",
  runValidators: true,
}
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};