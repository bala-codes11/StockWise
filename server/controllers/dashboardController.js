import Product from "../models/Product.js";

export const getDashboard = async (req, res, next) => {
  try {
    const owner = req.user._id;

    const [
      totalProducts,
      quantityResult,
      inventoryValueResult,
      lowStockCount,
      outOfStockCount,
      recentProducts,
      categoryStats,
    ] = await Promise.all([
      Product.countDocuments({ owner }),

      Product.aggregate([
        { $match: { owner } },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: "$quantity" },
          },
        },
      ]),

      Product.aggregate([
        { $match: { owner } },
        {
          $group: {
            _id: null,
            inventoryValue: {
              $sum: { $multiply: ["$price", "$quantity"] },
            },
          },
        },
      ]),

      Product.countDocuments({
        owner,
        $expr: {
          $and: [
            { $gt: ["$quantity", 0] },
            { $lte: ["$quantity", "$lowStockThreshold"] },
          ],
        },
      }),

      Product.countDocuments({ owner, quantity: 0 }),

      Product.find({ owner })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("name sku category price quantity lowStockThreshold updatedAt"),

      Product.aggregate([
        { $match: { owner } },
        {
          $group: {
            _id: "$category",
            productCount: { $sum: 1 },
            totalUnits: { $sum: "$quantity" },
            inventoryValue: {
              $sum: { $multiply: ["$price", "$quantity"] },
            },
          },
        },
        { $sort: { productCount: -1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUnits: quantityResult[0]?.totalUnits ?? 0,
        inventoryValue: inventoryValueResult[0]?.inventoryValue ?? 0,
        lowStockCount,
        outOfStockCount,
      },
      recentProducts,
      categoryStats,
    });
  } catch (error) {
    next(error);
  }
};