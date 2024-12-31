const router = require("express").Router();
const Scheme = require("../models/Scheme");
const schemes = require("../config/schemes.json");

router.get("/schemes", async (req, res) => {
  const {
    page = 1,
    limit = 5,
    state,
    cropType,
    incomeLevel,
    search,
    sortBy = "schemeName",
    order = "asc",
  } = req.query;

  // Prepare query object
  const query = {};
  if (state) query.state = state;
  if (cropType) query.cropType = cropType;
  if (incomeLevel) query.incomeLevel = incomeLevel;
  if (search) query.schemeName = { $regex: search, $options: "i" }; // Search by schemeName, case-insensitive

  // Prepare sorting
  const sortOptions = {};
  sortOptions[sortBy] = order === "asc" ? 1 : -1;

  try {
    const totalSchemes = await Scheme.countDocuments(query);
    const schemes = await Scheme.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions)
      .exec();

    res.json({
      error: false,
      total: totalSchemes,
      page,
      limit,
      schemes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to fetch schemes" });
  }
});
// Uncomment to insert schemes from JSON file to the database
// const insertSchemes = async () => {
//     try {
//         const docs = await Scheme.insertMany(schemes);
//         console.log(docs);
//     } catch (err) {
//         console.log(err);
//     }
// };

// insertSchemes();

module.exports = router;
