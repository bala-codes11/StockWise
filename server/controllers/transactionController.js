import mongoose from "mongoose";
import Product from "../models/Product.js";

export const addStockMovement = async (req, res, next) => {
  try {
    const { type, quantity, note = "" } = req.body;

    // Validate product ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Validate movement type
    if (!["IN", "OUT"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be IN or OUT",
      });
    }

    // Validate quantity
    if (
      quantity === "" ||
      quantity === null ||
      quantity === undefined ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    // Validate note
    if (typeof note !== "string" || note.length > 250) {
      return res.status(400).json({
        success: false,
        message: "Note must be a string of at most 250 characters",
      });
    }

    const amount = Number(quantity);
    const change = type === "IN" ? amount : -amount;

    const filter = {
      _id: new mongoose.Types.ObjectId(req.params.id),
      owner: req.user._id,
    };

    // Prevent removing more stock than available
    if (type === "OUT") {
      filter.quantity = { $gte: amount };
    }

    const product = await Product.findOneAndUpdate(
      filter,
      [
        {
          $set: {
            quantity: {
              $add: ["$quantity", change],
            },
            stockMovements: {
              $concatArrays: [
                { $ifNull: ["$stockMovements", []] },
                [
                  {
                    type: { $literal: type },
                    quantity: amount,
                    previousQuantity: "$quantity",
                    newQuantity: {
                      $add: ["$quantity", change],
                    },
                    note: { $literal: note.trim() },
                    performedBy: req.user._id,
                    createdAt: "$$NOW",
                  },
                ],
              ],
            },
          },
        },
      ],
      {
        returnDocument: "after",
        updatePipeline: true,
      }
    );

    if (!product) {
      const exists = await Product.exists({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Insufficient stock for this operation",
      });
    }

    const movement =
      product.stockMovements[
        product.stockMovements.length - 1
      ];

    return res.status(200).json({
      success: true,
      message: `Stock ${
        type === "IN" ? "added" : "removed"
      } successfully`,
      product,
      movement,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const page = Math.max(
      1,
      Number.parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(req.query.limit, 10) || 10
      )
    );

    const result = await Product.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(
            req.user._id
          ),
        },
      },
      {
        $unwind: "$stockMovements",
      },
      {
        $sort: {
          "stockMovements.createdAt": -1,
        },
      },
      {
        $facet: {
          transactions: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                _id: "$stockMovements._id",
                productId: "$_id",
                productName: "$name",
                sku: "$sku",
                type: "$stockMovements.type",
                quantity: "$stockMovements.quantity",
                previousQuantity:
                  "$stockMovements.previousQuantity",
                newQuantity:
                  "$stockMovements.newQuantity",
                note: "$stockMovements.note",
                performedBy:
                  "$stockMovements.performedBy",
                createdAt: "$stockMovements.createdAt",
              },
            },
          ],
          totalCount: [
            { $count: "total" },
          ],
        },
      },
    ]);

    const transactions =
      result[0]?.transactions ?? [];

    const total =
      result[0]?.totalCount[0]?.total ?? 0;

    return res.status(200).json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
