const { body, validationResult } = require("express-validator");

exports.validateTask = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description required"),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success:false,
        errors: errors.array()
      });
    }

    next();
  }
];