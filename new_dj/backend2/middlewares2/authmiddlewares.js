const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token based on role
      if (decoded.role === "doctor") {
        req.user = await Doctor.findById(decoded.id).select("-password");
      } else {
        req.user = await Patient.findById(decoded.id).select("-password");
      }

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Grant access to specific roles globally
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
       return res.status(403).json({ 
           message: `Role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this routing layer` 
       });
    }
    next();
  };
};

module.exports = { protect, authorize };
