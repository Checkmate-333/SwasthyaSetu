// @desc    Test server health
// @route   GET /api/test
// @access  Public
const testServer = (req, res) => {
  res.status(200).send("Server is running");
};

module.exports = {
  testServer,
};
