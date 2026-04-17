const Shipping = require('../models/Shipping');

exports.getShipping = async (req, res) => {
  const options = await Shipping.find();
  res.json(options);
};

exports.createShipping = async (req, res) => {
  const newOption = new Shipping(req.body);
  await newOption.save();
  res.json(newOption);
};
