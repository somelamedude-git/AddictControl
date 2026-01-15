const {Test} = require('../models/Test.model');
const { User, Addict } = require('../models/Users.model');

const fetch_past_results = async (req, res) => {
  try {
    if (!req.user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let { limit, page } = req.query;

    limit = Math.min(Number(limit) || 5, 10);
    page = Math.max(Number(page) || 1, 1);

    const skip = (page - 1) * limit;
    let user_id = req.user_id;

	const user = await User.findById(user_id);
	if(user.role === 'Family') {
		const addict = await Addict.findOne({email: user.addict_member_email})
		user_id = addict._id
	}

    const [test_results, total] = await Promise.all([
      Test.find({ alcoholic_id: user_id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Test.countDocuments({ alcoholic_id: user_id }),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      hasNextPage: skip + limit < total,
      test_results,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Couldn't fetch results, try again",
    });
  }
}

module.exports = {
	fetch_past_results
}

